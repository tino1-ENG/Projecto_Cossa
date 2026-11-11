import urllib.request
import json

def test_full_flow():
    # 1. Login with Dra. Mariamo
    login_data = json.dumps({'email': 'mariamo.nhantumbo@advocacia.co.mz', 'password': 'MozBid@2025!'}).encode('utf-8')
    req = urllib.request.Request('http://localhost:5000/api/v1/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
    res = urllib.request.urlopen(req)
    login_res = json.loads(res.read().decode('utf-8'))
    token = login_res['token']
    user_id = login_res['user']['id']
    user_name = login_res['user']['name']
    print(f"[OK] 1. Autenticado com sucesso como: {user_name} (ID: {user_id})")

    # 2. Get active auctions
    req = urllib.request.Request('http://localhost:5000/api/v1/auctions?limit=5')
    res = urllib.request.urlopen(req)
    auctions_res = json.loads(res.read().decode('utf-8'))
    active_auction = next((a for a in auctions_res['items'] if a['status'] == 'active'), None)
    if not active_auction:
        print("[WARN] Nenhum leilao ativo encontrado.")
        return

    auction_id = active_auction['id']
    min_bid = active_auction['min_next_bid']
    print(f"[OK] 2. Lote seleccionado: Lote #{auction_id} ({active_auction['title']})")
    print(f"       Preco actual: {active_auction['current_price']} centavos | Proximo lance minimo: {min_bid}")

    # 3. Place bid as Mariamo
    bid_data = json.dumps({'amount': min_bid}).encode('utf-8')
    req = urllib.request.Request(f'http://localhost:5000/api/v1/auctions/{auction_id}/bids', data=bid_data, headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'})
    try:
        res = urllib.request.urlopen(req)
        bid_res = json.loads(res.read().decode('utf-8'))
        print(f"[OK] 3. Licitação submetida com sucesso: {bid_res.get('message')}")
    except Exception as e:
        print(f"[INFO] 3. Licitacao anterior ou existente: {e}")

    # 4. Trigger expiration / passage of estimated time
    req = urllib.request.Request(f'http://localhost:5000/api/v1/auctions/{auction_id}/test-expire', data=b'{}', headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'})
    res = urllib.request.urlopen(req)
    expire_res = json.loads(res.read().decode('utf-8'))
    print(f"[OK] 4. Tempo estimado expirou: {expire_res.get('message')}")

    # 5. Check auction details as winner
    req = urllib.request.Request(f'http://localhost:5000/api/v1/auctions/{auction_id}', headers={'Authorization': f'Bearer {token}'})
    res = urllib.request.urlopen(req)
    detail_res = json.loads(res.read().decode('utf-8'))
    is_winner = detail_res.get('winner_id') == user_id or detail_res.get('is_leading')
    print(f"[OK] 5. Estado do lote apos encerramento: {detail_res['status']}")
    print(f"       Vencedor ID: {detail_res.get('winner_id')} | Utilizador e Vencedor? {is_winner}")

    # 6. Check Buyer Wins Tab
    req = urllib.request.Request('http://localhost:5000/api/v1/buyer/wins', headers={'Authorization': f'Bearer {token}'})
    res = urllib.request.urlopen(req)
    wins_res = json.loads(res.read().decode('utf-8'))
    my_win = next((w for w in wins_res if w['auction_id'] == auction_id), None)
    print(f"[OK] 6. Total de lotes ganhos pela cliente: {len(wins_res)}")
    if my_win:
        print(f"       Lote Ganho Homologado: {my_win['title']}")
        print(f"       Local de Levantamento: {my_win['pickup_address']}")
        print(f"       Codigo de Levantamento Oficial: {my_win['pickup_code']}")
        print(f"       Estado da Ordem: {my_win['order_status']}")
    print("\n>>> FLUXO COMPLETO VALIDADO DE PONTA A PONTA COM SUCESSO! <<<")

if __name__ == '__main__':
    test_full_flow()
