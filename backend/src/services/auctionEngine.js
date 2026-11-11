import {
  Auction,
  Product,
  Order,
  Notification,
  Delivery,
  User,
  getNextSequence
} from '../models/index.js';
import { broadcastAuctionEnded } from '../sockets/index.js';

/**
 * Finaliza um leilão de forma atómica e idempotente:
 * 1. Determina se houve vencedor com base no preço de reserva e maior lance.
 * 2. Atualiza o estado para 'awaiting_payment' (se ganho) ou 'unsold' (se não atingiu reserva/sem lances).
 * 3. Cria a encomenda (Order) e o registo de entrega/levantamento (Delivery).
 * 4. Notifica o comprador vencedor com instruções de levantamento e pagamento.
 * 5. Notifica o vendedor consignador.
 * 6. Dispara o evento WebSockets 'auction.ended' em tempo real.
 */
export async function finalizeAuction(auction) {
  try {
    // Evitar processar leilões que já foram fechados
    if (['ended', 'sold', 'awaiting_payment', 'unsold'].includes(auction.status)) {
      return { alreadyFinalized: true, status: auction.status };
    }

    const product = await Product.findOne({ id: auction.product_id }).lean();
    const productTitle = product?.title || `Lote #${auction.id}`;
    const locationCity = product?.location_city || 'Maputo';
    const locationProvince = product?.location_province || 'Maputo Cidade';

    console.log(`[Auction Engine] Finalizing Auction #${auction.id} ("${productTitle}")`);

    const reserveMet = !auction.reserve_price || auction.current_price >= auction.reserve_price;
    const hasWinner = Boolean(auction.winner_id && auction.bid_count > 0 && reserveMet);
    const newStatus = hasWinner ? 'awaiting_payment' : 'unsold';

    // 1. Atualizar Auction no MongoDB
    auction.status = newStatus;
    await auction.save();

    if (hasWinner) {
      // 3. Criar Encomenda (Order)
      let order = await Order.findOne({ auction_id: auction.id });
      let orderId = order?.id;

      if (!order) {
        orderId = await getNextSequence('order_id');
        order = new Order({
          id: orderId,
          auction_id: auction.id,
          buyer_id: auction.winner_id,
          seller_id: auction.seller_id,
          total_amount: auction.current_price,
          status: 'pending_payment'
        });
        await order.save();

        // Criar registo de Entrega / Levantamento presencial
        const deliverySeq = await getNextSequence('delivery_id');
        const trackingCode = `MZB-REC-${String(auction.id).padStart(4, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
        const pickupDelivery = new Delivery({
          id: deliverySeq,
          order_id: orderId,
          status: 'processing',
          tracking_number: trackingCode,
          courier_name: 'MozBid Guarda Fiduciária e Desalfandegamento',
          address: `Armazém Oficial MozBid / Terminal Portuário, ${locationCity}, ${locationProvince}`,
          estimated_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          notes: 'Agendamento prévio com o fiel depositário mediante apresentação de BI/DIRE e NUIT.'
        });
        await pickupDelivery.save();
      }

      // 4. Notificar Vencedor no MongoDB
      const winnerUser = await User.findOne({ id: auction.winner_id }).lean();
      const notifWinner = new Notification({
        id: await getNextSequence('notification_id'),
        user_id: auction.winner_id,
        title: '🏆 PARABÉNS! Arrematou o leilão com sucesso!',
        message: `Foi o vencedor oficial do lote "${productTitle}" com a oferta final de ${(auction.current_price / 100).toLocaleString('pt-MZ')} MZN. Consulte o guia e as instruções de levantamento presencial.`,
        type: 'auction_won',
        is_read: false,
        link: '/buyer/dashboard?tab=wins'
      });
      await notifWinner.save();

      // 5. Notificar Vendedor no MongoDB
      const notifSeller = new Notification({
        id: await getNextSequence('notification_id'),
        user_id: auction.seller_id,
        title: 'Leilão Concluído com Sucesso!',
        message: `O leilão "${productTitle}" foi arrematado por ${(auction.current_price / 100).toLocaleString('pt-MZ')} MZN. O comprador foi notificado para liquidação e levantamento.`,
        type: 'auction_ended',
        is_read: false,
        link: '/seller/dashboard?tab=orders'
      });
      await notifSeller.save();

      // 6. Transmitir WebSockets em tempo real
      broadcastAuctionEnded(auction.id, {
        auctionId: auction.id,
        status: 'ended',
        auctionStatus: 'awaiting_payment',
        winnerId: auction.winner_id,
        winnerName: winnerUser?.name || 'Licitador Oficial',
        finalPrice: auction.current_price,
        reserveMet: true,
        orderId,
        title: productTitle,
        locationCity,
        locationProvince
      });

      return {
        success: true,
        hasWinner: true,
        winnerId: auction.winner_id,
        winnerName: winnerUser?.name,
        finalPrice: auction.current_price,
        orderId
      };
    } else {
      // Notificar vendedor de leilão não vendido
      const notifUnsold = new Notification({
        id: await getNextSequence('notification_id'),
        user_id: auction.seller_id,
        title: 'Leilão Encerrado Sem Vencedor',
        message: `O leilão "${productTitle}" encerrou sem atingir o preço de reserva ou sem licitações válidas.`,
        type: 'auction_ended',
        is_read: false,
        link: '/seller/dashboard?tab=auctions'
      });
      await notifUnsold.save();

      broadcastAuctionEnded(auction.id, {
        auctionId: auction.id,
        status: 'unsold',
        auctionStatus: 'unsold',
        winnerId: null,
        finalPrice: auction.current_price,
        reserveMet: false,
        title: productTitle
      });

      return {
        success: true,
        hasWinner: false
      };
    }
  } catch (err) {
    console.error(`[Auction Engine Error] Finalizing auction #${auction.id}:`, err);
    throw err;
  }
}
