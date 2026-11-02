import bcrypt from 'bcryptjs';
import { db, runTransaction } from './db.js';
import { runMigrations } from './migrate.js';
import { fileURLToPath } from 'node:url';

/**
 * MozBid Database Seeder — Institutional Luxury Auction Marketplace
 * Curated authentic lots in Mozambique with official local documentation & local images
 */
export function seed() {
  console.log('[SQLite] Running migrations before seeding...');
  runMigrations();

  console.log('[SQLite] Seeding database with official Mozambican luxury auction data and local images...');

  runTransaction((database) => {
    // Clear existing data safely
    database.exec(`
      DELETE FROM audit_logs;
      DELETE FROM notifications;
      DELETE FROM deliveries;
      DELETE FROM payments;
      DELETE FROM orders;
      DELETE FROM watchlist;
      DELETE FROM auto_bids;
      DELETE FROM bids;
      DELETE FROM product_images;
      DELETE FROM auctions;
      DELETE FROM products;
      DELETE FROM categories;
      DELETE FROM seller_profiles;
      DELETE FROM users;
    `);

    // 1. Insert Core Users with secure Bcrypt hashes
    const salt = bcrypt.genSaltSync(10);
    const defaultPasswordHash = bcrypt.hashSync('mozbid123', salt);

    const insertUser = database.prepare(`
      INSERT INTO users (id, name, email, phone, password_hash, role, is_verified, balance, city, province)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Admin
    insertUser.run(1, 'Conselho de Administração MozBid', 'admin@mozbid.co.mz', '+258840000001', defaultPasswordHash, 'admin', 1, 5000000000, 'Maputo Cidade', 'Maputo Cidade');
    // Institutional Corporate Seller
    insertUser.run(2, 'AutoLux Moçambique Sociedade Unipessoal Lda', 'autolux@mozbid.co.mz', '+258843000002', defaultPasswordHash, 'seller', 1, 2500000000, 'Maputo Cidade', 'Maputo Cidade');
    // Private Mining & Heavy Machinery Consignor
    insertUser.run(3, 'Consórcio Mineiro Cossa & Associados', 'armando.cossa@gmail.com', '+258842000003', defaultPasswordHash, 'seller', 1, 1500000000, 'Tete', 'Tete');
    // Verified Executive Buyer 1 (Dra. Mariamo)
    insertUser.run(4, 'Dra. Mariamo Nhantumbo', 'mariamo.nhantumbo@gmail.com', '+258845556677', defaultPasswordHash, 'buyer', 1, 200000000, 'Maputo Cidade', 'Maputo Cidade'); // 2M MZN in escrow
    // Verified Executive Buyer 2 (Carlos Tembe)
    insertUser.run(5, 'Eng. Carlos Alberto Tembe', 'carlos.tembe@gmail.com', '+258823334455', defaultPasswordHash, 'buyer', 1, 350000000, 'Matola', 'Maputo Província'); // 3.5M MZN
    // Corporate Buyer 3 (Rui de Carvalho)
    insertUser.run(6, 'Dr. Rui de Carvalho', 'rui.carvalho@empresa.co.mz', '+258869998877', defaultPasswordHash, 'buyer', 1, 500000000, 'Beira', 'Sofala'); // 5M MZN

    // 2. Insert Seller Profiles
    const insertSeller = database.prepare(`
      INSERT INTO seller_profiles (user_id, company_name, nuit, business_type, verified_status, rating, total_sales, address, bank_name, bank_account)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertSeller.run(2, 'AutoLux Moçambique Sociedade Unipessoal Lda', '400192837', 'company', 'verified', 4.98, 48, 'Avenida Julius Nyerere, n.º 1420, Polana Cimento, Maputo', 'Millennium BIM', '1092837461001');
    insertSeller.run(3, 'Consórcio Mineiro Cossa & Associados', '201948572', 'company', 'verified', 4.95, 34, 'Estrada Nacional n.º 7, Zona Industrial de Moatize, Tete', 'Banco Comercial e de Investimentos (BCI)', '9028374619901');

    // 3. Insert Categories
    const insertCat = database.prepare(`
      INSERT INTO categories (id, name, slug, icon, description, featured)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertCat.run(1, 'Automóveis & Colecionáveis', 'automoveis-motos', 'directions_car', 'Supercarros, frotas corporativas executivas, SUVs de luxo e clássicos homologados.', 1);
    insertCat.run(2, 'Equipamento Industrial & Minas', 'maquinas-industriais', 'precision_manufacturing', 'Escavadoras hidráulicas, bulldozers, geradores pesados e camiões basculantes.', 1);
    insertCat.run(3, 'Relojoaria Suíça & Alta Joalharia', 'relogios-joias', 'watch', 'Cronómetros suíços certificados com proveniência e caixa de origem.', 1);
    insertCat.run(4, 'Tecnologia Empresarial & Servidores', 'tecnologia-computadores', 'devices', 'Workstations Apple Silicon, servidores rack enterprise e frotas corporativas.', 1);
    insertCat.run(5, 'Imobiliário & Propriedades Comerciais', 'imobiliario-terrenos', 'domain', 'Escritórios Prime na Polana, armazéns logísticos e lotes para desenvolvimento.', 1);
    insertCat.run(6, 'Liquidação Comercial & Ativos', 'outros', 'storefront', 'Ativos institucionais, equipamentos marítimos e liquidações bancárias com curadoria.', 1);

    // Helpers
    const insertProduct = database.prepare(`
      INSERT INTO products (id, seller_id, category_id, title, description, brand, model, year, condition, mileage_or_hours, fuel_type, transmission, location_province, location_city, specifications_json, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertImage = database.prepare(`
      INSERT INTO product_images (product_id, image_url, is_primary, display_order)
      VALUES (?, ?, ?, ?)
    `);

    const insertAuction = database.prepare(`
      INSERT INTO auctions (id, product_id, seller_id, status, starting_price, reserve_price, current_price, bid_increment, bid_count, starts_at, ends_at, winner_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertBid = database.prepare(`
      INSERT INTO bids (auction_id, bidder_id, amount, is_auto, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    const now = new Date();
    const inMins = (m) => new Date(now.getTime() + m * 60 * 1000).toISOString();
    const inHours = (h) => new Date(now.getTime() + h * 60 * 60 * 1000).toISOString();
    const inDays = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000).toISOString();
    const agoHours = (h) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();

    // -------------------------------------------------------------
    // PRODUCT 1: Porsche 911 GT3 RS Clubsport (Featured Hero Live Lot)
    // -------------------------------------------------------------
    insertProduct.run(
      1,
      2, // AutoLux
      1,
      'Porsche 911 GT3 RS Clubsport 2023 — Pacote Weissach Carbono',
      'Exemplar irrepreensível em Cinzento Ágata com elementos aerodinâmicos em fibra de carbono exposta. Motor Boxer 4.0L atmosférico de 6 cilindros capaz de atingir 9.000 rpm e 525 cv de potência pura, transmissão PDK de dupla embraiagem com 7 velocidades calibrada para pista, travões carbono-cerâmicos PCCB com pinças amarelas e roll-cage homologado FIA. Importação oficial com todos os direitos aduaneiros liquidados pelas Alfândegas de Maputo e registo no INATTER.',
      'Porsche',
      '911 GT3 RS Clubsport (992)',
      2023,
      'used_like_new',
      '4,850 km',
      'Gasolina 98 Octanas',
      'PDK 7 Velocidades Sequencial',
      'Maputo Cidade',
      'Entreposto Aduaneiro do Porto de Maputo',
      JSON.stringify({
        'Número de Chassi / VIN': 'WP0ZZZ99ZPS291823',
        'Motor': '4.0L Boxer 6 Cilindros Atmosférico (525 cv / 465 Nm)',
        'Velocidade Máxima': '296 km/h (0-100 km/h em 3.2s)',
        'Aceleração Lateral': '1.5G com Downforce Ativo DRS',
        'Pacote Aerodinâmico': 'Weissach Package em Carbono Leve',
        'Desembaraço Aduaneiro': 'DUA n.º 2024/04192/MP — Direitos Pagos na Totalidade',
        'Livrete Nacional': 'Livrete e Título de Registo Automóvel Emitido (INATTER Maputo)',
        'Inspeção Periódica': 'Certificado de Inspeção Periódica Obrigatória Válido até 2027',
        'Custódia Fiduciária': 'Garantia Bancária Segregada no Banco Comercial e de Investimentos (BCI)'
      }),
      'approved'
    );
    insertImage.run(1, '/images/products/porsche-911-gt3rs.jpg', 1, 1);
    insertImage.run(1, '/images/products/bmw-m4-competition.jpg', 0, 2);

    insertAuction.run(
      1,
      1,
      2,
      'active',
      1650000000, // 16,500,000 MZN
      1800000000, // Reserve 18,000,000 MZN
      1845000000, // Current: 18,450,000 MZN (Reserva Atingida!)
      10000000,   // Increment: 100,000 MZN
      38,
      agoHours(36),
      inHours(4),
      4 // Mariamo leading
    );

    insertBid.run(1, 5, 1700000000, 0, agoHours(28));
    insertBid.run(1, 6, 1750000000, 0, agoHours(20));
    insertBid.run(1, 4, 1800000000, 0, agoHours(12));
    insertBid.run(1, 5, 1820000000, 0, agoHours(6));
    insertBid.run(1, 4, 1845000000, 0, agoHours(1));

    // -------------------------------------------------------------
    // PRODUCT 2: BMW M4 Competition Coupé 2023 (Ending Soon)
    // -------------------------------------------------------------
    insertProduct.run(
      2,
      2, // AutoLux
      1,
      'BMW M4 Competition Coupé 2023 — M xDrive 510cv',
      'Configuração exclusiva em Azul Tanzanite Metálico com acabamento interior em couro Merino Silverstone e frisos em fibra de carbono. Equipado com motor 3.0 S58 TwinPower Turbo debitando 510 cv, transmissão desportiva M Steptronic com Drivelogic e sistema de tração inteligente M xDrive. Travões carbono-cerâmicos M, faróis BMW Laserlight, sistema de som Harman Kardon e apenas 18,500 km rodados com histórico completo na Baviera Moçambique.',
      'BMW',
      'M4 Competition Coupé',
      2023,
      'used_like_new',
      '18,500 km',
      'Gasolina',
      'Automática M Steptronic 8v',
      'Maputo Cidade',
      'Maputo (Polana Cimento)',
      JSON.stringify({
        'Número de Chassi / VIN': 'WBA33AY08PFP29184',
        'Motor': '3.0L S58 TwinPower Turbo (510 cv / 650 Nm)',
        'Tração': 'M xDrive Integral Selecionável (4WD / 4WD Sport / 2WD)',
        'Aceleração 0-100 km/h': '3.5 segundos',
        'Documentação': 'Livrete nacional, DUA n.º 2023/11029/MP, Imposto Municipal de Veículos liquidado',
        'Garantia': 'Histórico verificado na Baviera Maputo com garantia até 2026'
      }),
      'approved'
    );
    insertImage.run(2, '/images/products/bmw-m4-competition.jpg', 1, 1);
    insertImage.run(2, '/images/products/porsche-911-gt3rs.jpg', 0, 2);

    insertAuction.run(
      2,
      2,
      2,
      'active',
      450000000, // 4,500,000 MZN
      480000000,
      495000000, // 4,950,000 MZN
      5000000,   // Increment: 50,000 MZN
      14,
      agoHours(40),
      inMins(18), // Termina dentro de 18 minutos!
      5 // Carlos leading
    );

    insertBid.run(2, 4, 460000000, 0, agoHours(24));
    insertBid.run(2, 6, 475000000, 0, agoHours(16));
    insertBid.run(2, 4, 485000000, 0, agoHours(8));
    insertBid.run(2, 5, 495000000, 0, agoHours(2));

    // -------------------------------------------------------------
    // PRODUCT 3: Rolex Submariner Date 41mm Oystersteel
    // -------------------------------------------------------------
    insertProduct.run(
      3,
      2, // AutoLux
      3,
      'Rolex Submariner Date 41mm Oystersteel — Ref. 126610LN',
      'Ícone da alta relojoaria suíça em aço Oystersteel 904L com bisel Cerachrom em cerâmica preta e mostrador Chromalight de alta visibilidade. Calibre de manufactura Rolex 3235 com 70 horas de reserva de marcha e certificação Cronómetro Superlativo (-2/+2 seg/dia). Pulseira Oyster com fecho de segurança Oysterlock e sistema de extensão Glidelock. Acompanha estojo original verde, manual, livrete de garantia internacional e certificado de autenticidade notarial.',
      'Rolex',
      'Submariner Date 126610LN',
      2023,
      'used_like_new',
      'Estado Impecável / Não Polido',
      'Automático Calibre 3235',
      'Glidelock Extension',
      'Maputo Cidade',
      'Maputo (Sommerschield)',
      JSON.stringify({
        'Número de Série': '892J1802-CH',
        'Diâmetro da Caixa': '41 mm em Aço Oystersteel 904L',
        'Impermeabilidade': '300 metros / 1.000 pés com válvula de hélio',
        'Garantia': 'Garantia Internacional Rolex ativa até 2028',
        'Proveniência': 'Adquirido em concessionário oficial com fatura e desembaraço fiscal'
      }),
      'approved'
    );
    insertImage.run(3, '/images/products/rolex-submariner.jpg', 1, 1);
    insertImage.run(3, '/images/products/patek-philippe.jpg', 0, 2);

    insertAuction.run(
      3,
      3,
      2,
      'active',
      120000000, // 1,200,000 MZN
      135000000,
      142000000, // 1,420,000 MZN
      2000000,   // 20,000 MZN
      23,
      agoHours(30),
      inMins(34), // 34 minutos restantes
      4 // Mariamo leading
    );

    insertBid.run(3, 5, 125000000, 0, agoHours(22));
    insertBid.run(3, 6, 135000000, 0, agoHours(12));
    insertBid.run(3, 4, 142000000, 0, agoHours(1));

    // -------------------------------------------------------------
    // PRODUCT 4: Toyota Land Cruiser 300 V6 ZX 2023
    // -------------------------------------------------------------
    insertProduct.run(
      4,
      2, // AutoLux
      1,
      'Toyota Land Cruiser 300 ZX 3.3D V6 Twin-Turbo 2023',
      'Versão ZX topo de gama em Branco Pérola com interior em couro bege perfurado com ventilação e aquecimento. Motor 3.3L V6 Twin-Turbo Diesel debitando 306 cv e impressionantes 700 Nm de binário, transmissão automática de 10 velocidades, suspensão adaptativa AVS, teto solar panorâmico, sistema de som JBL Synthesis com 14 altifalantes e guincho elétrico frontal embutido. Apenas 12,200 km, com histórico completo na Toyota Moçambique.',
      'Toyota',
      'Land Cruiser 300 ZX',
      2023,
      'used_like_new',
      '12,200 km',
      'Diesel',
      'Automática 10 Velocidades',
      'Maputo Província',
      'Matola',
      JSON.stringify({
        'Número de Chassi / VIN': 'JTEBU3FJ9PK019284',
        'Motor': '3.3L F33A-FTV V6 Twin-Turbo Diesel (306 cv / 700 Nm)',
        'Capacidade': '7 Lugares com rebatimento elétrico',
        'Tração': 'Integral Permanente 4WD com Bloqueio de Diferencial Central e Traseiro',
        'Documentação': 'Livrete INATTER, DUA n.º 2023/08492/MP, Imposto Pago'
      }),
      'approved'
    );
    insertImage.run(4, '/images/products/land-cruiser-300.jpg', 1, 1);
    insertImage.run(4, '/images/products/hilux-legend-rs.jpg', 0, 2);

    insertAuction.run(
      4,
      4,
      2,
      'active',
      750000000, // 7,500,000 MZN
      780000000,
      810000000, // 8,100,000 MZN
      5000000,   // Increment: 50,000 MZN
      18,
      agoHours(50),
      inMins(48), // 48 minutos restantes
      5 // Carlos leading
    );

    insertBid.run(4, 4, 760000000, 0, agoHours(36));
    insertBid.run(4, 6, 780000000, 0, agoHours(20));
    insertBid.run(4, 4, 795000000, 0, agoHours(10));
    insertBid.run(4, 5, 810000000, 0, agoHours(1));

    // -------------------------------------------------------------
    // PRODUCT 5: Escavadora Hidráulica Caterpillar 320D 2021
    // -------------------------------------------------------------
    insertProduct.run(
      5,
      3, // Consórcio Cossa
      2,
      'Escavadora Hidráulica Caterpillar CAT 320D Next Gen 2021',
      'Escavadora pesada de rastos de 22 toneladas, equipada com balde reforçado de 1.15 m³ para minério e rocha, cabine climatizada com certificação ROPS/FOPS, câmara de visão 360 graus e telemática Cat Product Link com monitorização de horas e consumo em direto. Com apenas 2.100 horas de laboração certificadas pela Barloworld Equipment Moçambique. Todas as revisões preventivas efetuadas.',
      'Caterpillar',
      '320D Next Gen Excavator',
      2021,
      'used_good',
      '2,100 Horas Certificadas',
      'Diesel',
      'Transmissão Hidrostática',
      'Tete',
      'Moatize (Bacia Carbonífera de Tete)',
      JSON.stringify({
        'Número de Série / VIN': 'CAT0320DCKP09812',
        'Peso Operacional': '21.900 kg',
        'Motor': 'Cat C4.4 ACERT Turbodiesel (146 cv)',
        'Profundidade Máxima': '6.72 metros',
        'Capacidade do Balde': '1.15 m³ Heavy Duty',
        'Documentação': 'Registo de Ativo Industrial n.º TTE-4920/2021, DUA e Certificado de Origem'
      }),
      'approved'
    );
    insertImage.run(5, '/images/products/cat-320-excavator.jpg', 1, 1);
    insertImage.run(5, '/images/products/komatsu-d65.jpg', 0, 2);

    insertAuction.run(
      5,
      5,
      3,
      'active',
      480000000, // 4,800,000 MZN
      500000000,
      520000000, // 5,200,000 MZN
      5000000,   // Increment: 50,000 MZN
      12,
      agoHours(60),
      inHours(1), // 1h 45m restantes
      6 // Rui leading
    );

    insertBid.run(5, 4, 490000000, 0, agoHours(45));
    insertBid.run(5, 5, 505000000, 0, agoHours(25));
    insertBid.run(5, 6, 520000000, 0, agoHours(5));

    // -------------------------------------------------------------
    // PRODUCT 6: Mercedes-AMG G63 Mansory 2024
    // -------------------------------------------------------------
    insertProduct.run(
      6,
      2, // AutoLux
      1,
      'Mercedes-AMG G63 Mansory Edition 2024 — V8 BiTurbo 850cv',
      'Exemplar topo de gama em Preto Carbono Mate com preparação exclusiva Mansory Widebody Carbon Aero. Motor V8 BiTurbo de 4.0 litros recalibrado para 850 cv e 1.000 Nm de binário, escape lateral desportivo em titânio com válvulas ativas, jantes forjadas Mansory de 24 polegadas e interior completo personalizado em couro Mandarin Orange com fibra de carbono forjada. Apenas 3,200 km, com desembaraço aduaneiro integral em Maputo.',
      'Mercedes-AMG',
      'G63 Mansory Widebody',
      2024,
      'used_like_new',
      '3,200 km',
      'Gasolina',
      'AMG SPEEDSHIFT PLUS 9G-TRONIC',
      'Maputo Cidade',
      'Polana Cimento, Maputo',
      JSON.stringify({
        'Número de Chassi / VIN': 'WDB4632761X09182',
        'Motor': '4.0L V8 BiTurbo Mansory Spec (850 cv / 1.000 Nm)',
        'Tração': 'Integral Permanente 4MATIC com 3 Bloqueios de Diferencial 100%',
        'Aceleração 0-100 km/h': '3.5 segundos',
        'Documentação': 'DUA n.º 2024/02819/MP, Livrete Nacional, Certificado Mansory Gmbh'
      }),
      'approved'
    );
    insertImage.run(6, '/images/products/mercedes-amg-g63.jpg', 1, 1);
    insertImage.run(6, '/images/products/porsche-911-gt3rs.jpg', 0, 2);

    insertAuction.run(
      6,
      6,
      2,
      'active',
      2200000000, // 22,000,000 MZN
      2400000000,
      2470000000, // 24,700,000 MZN
      10000000,   // Increment: 100,000 MZN
      42,
      agoHours(72),
      inDays(2),
      4 // Mariamo leading
    );

    insertBid.run(6, 5, 2300000000, 0, agoHours(50));
    insertBid.run(6, 6, 2400000000, 0, agoHours(30));
    insertBid.run(6, 4, 2470000000, 0, agoHours(8));

    // -------------------------------------------------------------
    // PRODUCT 7: Patek Philippe Nautilus 5711/1A
    // -------------------------------------------------------------
    insertProduct.run(
      7,
      2, // AutoLux
      3,
      'Patek Philippe Nautilus 5711/1A-010 — Mostrador Azul Dégradé',
      'A peça de relojoaria de coleção mais cobiçada do mundo, em aço inoxidável com o lendário mostrador azul dégradé com relevo horizontal horizontalizado e índices aplicados em ouro branco com revestimento luminescente. Calibre automático 324 S C visível através do fundo em vidro de safira. Peça descontinuada pela manufatura genebrina, entregue em estado de conservação de cofre com caixa de madeira nobre, certificado de origem e documentos notariais de titularidade.',
      'Patek Philippe',
      'Nautilus 5711/1A-010',
      2021,
      'used_like_new',
      'Estado de Coleção / Vault Condition',
      'Automático Calibre 324 S C',
      'Bracelete em Aço com Fecho Duplo',
      'Maputo Cidade',
      'Maputo (Polana Cimento)',
      JSON.stringify({
        'Número de Movimento': '5711-PP-849201',
        'Material': 'Aço Inoxidável Cirúrgico 316L',
        'Diâmetro': '40 mm (medido na diagonal das 10h às 4h)',
        'Reserva de Marcha': '45 Horas com Rotor Central em Ouro 21K',
        'Proveniência': 'Certidão de Origem Genebra e registo fiduciário em Maputo'
      }),
      'approved'
    );
    insertImage.run(7, '/images/products/patek-philippe.jpg', 1, 1);
    insertImage.run(7, '/images/products/rolex-submariner.jpg', 0, 2);

    insertAuction.run(
      7,
      7,
      2,
      'active',
      800000000, // 8,000,000 MZN
      850000000,
      895000000, // 8,950,000 MZN
      5000000,   // Increment: 50,000 MZN
      67,
      agoHours(90),
      inDays(3),
      6 // Rui leading
    );

    insertBid.run(7, 4, 820000000, 0, agoHours(60));
    insertBid.run(7, 5, 860000000, 0, agoHours(35));
    insertBid.run(7, 6, 895000000, 0, agoHours(12));

    // -------------------------------------------------------------
    // PRODUCT 8: Bulldozer Komatsu D65EX 2021
    // -------------------------------------------------------------
    insertProduct.run(
      8,
      3, // Consórcio Cossa
      2,
      'Bulldozer de Rastos Komatsu D65EX-18 2021 — Lâmina SigmaBlade',
      'Trator de esteiras pesado de 23 toneladas, equipado com lâmina inovadora SigmaBlade com aumento de 15% na capacidade de movimentação de terras, cabine ROPS com suspensão hidropneumática, sistema de transmissão hidrostática HSS com controlo por joystick e sistema de monitorização Komtrax via satélite ativo em Moçambique. Com apenas 1.840 horas de operação, pronto para mobilização imediata no corredor logístico de Nacala ou Tete.',
      'Komatsu',
      'D65EX-18 Crawler Dozer',
      2021,
      'used_good',
      '1,840 Horas',
      'Diesel',
      'Transmissão TORQFLOW com Lock-up',
      'Tete',
      'Tete (Moatize)',
      JSON.stringify({
        'Número de Série': 'KMTC0D65P09184',
        'Peso Operacional': '22.800 kg',
        'Motor': 'Komatsu SAA6D114E-6 Turbodiesel (217 cv)',
        'Lâmina': 'SigmaBlade com Capacidade de 5.61 m³',
        'Rastos': 'PLUS (Parallel Link Undercarriage System) com 85% de vida útil',
        'Certificação': 'Vistoria e teste de carga efetuados em Moatize'
      }),
      'approved'
    );
    insertImage.run(8, '/images/products/komatsu-d65.jpg', 1, 1);
    insertImage.run(8, '/images/products/cat-320-excavator.jpg', 0, 2);

    insertAuction.run(
      8,
      8,
      3,
      'active',
      1050000000, // 10,500,000 MZN
      1100000000,
      1120000000, // 11,200,000 MZN
      10000000,   // Increment: 100,000 MZN
      29,
      agoHours(80),
      inDays(1),
      5 // Carlos leading
    );

    insertBid.run(8, 4, 1080000000, 0, agoHours(50));
    insertBid.run(8, 6, 1100000000, 0, agoHours(25));
    insertBid.run(8, 5, 1120000000, 0, agoHours(10));

    // -------------------------------------------------------------
    // PRODUCT 9: Parque de Servidores Enterprise Studio (16 Unidades)
    // -------------------------------------------------------------
    insertProduct.run(
      9,
      2, // AutoLux
      4,
      'Parque de Servidores Enterprise Apple Silicon (16 Unidades M2 Ultra 192GB)',
      'Lote tecnológico de alta densidade proveniente de liquidação e modernização de data center financeiro em Maputo. Composto por 16 nós de computação Apple Silicon M2 Ultra de 24 núcleos de CPU e 76 núcleos de GPU, cada um com 192GB de Memória Unificada e 4TB SSD PCIe. Inclui bastidor de rack 42U APC insonorizado com PDUs trifásicas comutadas e módulos de refrigeração redundante. Todos os nós auditados com relatórios SMART a 100%.',
      'Apple Enterprise',
      'Studio Pro Server Node Fleet (16x)',
      2023,
      'used_like_new',
      'Auditado 100% Funcional',
      'Trifásico 400V / Redundante N+1',
      'N/A',
      'Maputo Cidade',
      'Avenida 24 de Julho, Maputo',
      JSON.stringify({
        'Nós de Computação': '16x Apple M2 Ultra (384 núcleos de CPU totais)',
        'Memória Total do Cluster': '3.072 GB (3 Terabytes) de Memória Unificada',
        'Armazenamento': '64 TB SSD NVMe ultra-rápido configurado em ZFS',
        'Rede': 'Conectividade Dupla 10GbE SFP+ por nó com Switch Arista 48x incluído',
        'Documentação': 'Termo de Desafetação de Ativo Bancário e Licenças Corporativas'
      }),
      'approved'
    );
    insertImage.run(9, '/images/products/studio-servers.jpg', 1, 1);
    insertImage.run(9, '/images/products/macbook-pro-m3.jpg', 0, 2);

    insertAuction.run(
      9,
      9,
      2,
      'active',
      420000000, // 4,200,000 MZN
      450000000,
      460000000, // 4,600,000 MZN
      5000000,   // Increment: 50,000 MZN
      18,
      agoHours(40),
      inDays(4),
      4 // Mariamo leading
    );

    insertBid.run(9, 6, 430000000, 0, agoHours(30));
    insertBid.run(9, 5, 450000000, 0, agoHours(18));
    insertBid.run(9, 4, 460000000, 0, agoHours(4));

    // -------------------------------------------------------------
    // PRODUCT 10: Toyota Hilux 2.8 GD-6 4x4 Legend RS 2022
    // -------------------------------------------------------------
    insertProduct.run(
      10,
      3, // Consórcio Cossa
      1,
      'Toyota Hilux 2.8 GD-6 4x4 Double Cab Legend RS 2022',
      'Pick-up de prestígio em Preto Grafite Metálico com acabamento Legend RS de topo. Motor 2.8 turbodiesel com 204 cv, tração 4x4 com bloqueio traseiro, cobertura de caixa retrátil motorizada original Toyota, roll-bar em aço inoxidável preto, estribos laterais e jantes especiais de 18 polegadas. Manutenções sempre efetuadas na concessionária oficial Toyota Moçambique na Beira.',
      'Toyota',
      'Hilux 2.8 GD-6 Legend RS',
      2022,
      'used_good',
      '44,800 km',
      'Diesel',
      'Automática 6 Velocidades',
      'Sofala',
      'Beira (Porto da Beira)',
      JSON.stringify({
        'Número de Chassi / VIN': 'MR0EB3CD9N019284',
        'Motor': '2.8L D-4D Turbodiesel (204 cv / 500 Nm)',
        'Tração': '4x4 com Seletor Eletrónico e Redutoras',
        'Documentação': 'Livrete INATTER Sofala, DUA regularizado, Inspecção válida até 2026'
      }),
      'approved'
    );
    insertImage.run(10, '/images/products/hilux-legend-rs.jpg', 1, 1);
    insertImage.run(10, '/images/products/land-cruiser-300.jpg', 0, 2);

    insertAuction.run(
      10,
      10,
      3,
      'active',
      270000000, // 2,700,000 MZN
      285000000,
      295000000, // 2,950,000 MZN
      2500000,   // Increment: 25,000 MZN
      15,
      agoHours(50),
      inHours(6),
      6 // Rui leading
    );

    insertBid.run(10, 5, 275000000, 0, agoHours(40));
    insertBid.run(10, 4, 285000000, 0, agoHours(25));
    insertBid.run(10, 6, 295000000, 0, agoHours(5));

    // -------------------------------------------------------------
    // PRODUCT 11: Gerador Industrial Cummins 150 kVA Silenciado
    // -------------------------------------------------------------
    insertProduct.run(
      11,
      2, // AutoLux
      2,
      'Gerador Industrial Cummins 150 kVA Silenciado — Canopy Anti-Corrosão',
      'Grupo gerador trifásico a diesel com alternador Stamford e controlador digital DeepSea DSE7320 com arranque automático em falha de rede (ATS integrado). Cabine insonorizada galvanizada resistente a corrosão marítima. Equipamento novo de stock com 0 horas de uso, pronto para entrega imediata em armazém em Nampula com montagem e teste de carga incluídos.',
      'Cummins',
      'C150D5 Silenced Generator',
      2024,
      'new',
      '0 Horas (Novo)',
      'Diesel',
      'Controlador Automático ATS',
      'Nampula',
      'Nampula (Zona Industrial de Marrere)',
      JSON.stringify({
        'Potência Standby': '165 kVA / 132 kW',
        'Potência Contínua': '150 kVA / 120 kW',
        'Tensão': '400V / 230V Trifásico 50Hz',
        'Consumo Médio': 'Aprox. 28 L/h a 75% de carga contínua',
        'Depósito': '350 Litros com Bacia de Retenção Ecológica'
      }),
      'approved'
    );
    insertImage.run(11, '/images/products/cummins-generator.jpg', 1, 1);

    insertAuction.run(
      11,
      11,
      2,
      'active',
      80000000, // 800,000 MZN
      85000000,
      89000000, // 890,000 MZN
      1500000,  // Increment: 15,000 MZN
      8,
      agoHours(60),
      inDays(1),
      5 // Carlos leading
    );

    insertBid.run(11, 4, 82000000, 0, agoHours(45));
    insertBid.run(11, 6, 86000000, 0, agoHours(25));
    insertBid.run(11, 5, 89000000, 0, agoHours(10));

    // -------------------------------------------------------------
    // PRODUCT 12: Apple MacBook Pro 16" M3 Max 64GB
    // -------------------------------------------------------------
    insertProduct.run(
      12,
      3, // Consórcio Cossa
      4,
      'Apple MacBook Pro 16" M3 Max (64GB RAM, 2TB SSD) — Space Black',
      'Configuração extrema com processador Apple M3 Max de 16 núcleos de CPU e 40 núcleos de GPU. 64GB de memória unificada ultrarrápida e armazenamento SSD PCIe de 2TB. Ecrã Liquid Retina XDR de 16.2 polegadas com tecnologia ProMotion de 120Hz e pico de brilho de 1600 nits. Inclui carregador MagSafe de 140W original e caixa completa. Estado irrepreensível, ciclo de bateria inferior a 35 ciclos.',
      'Apple',
      'MacBook Pro 16" M3 Max',
      2024,
      'used_like_new',
      '32 Ciclos de Bateria',
      'Bateria 100Wh',
      'N/A',
      'Maputo Cidade',
      'Maputo (Polana Cimento)',
      JSON.stringify({
        'Processador': 'Apple M3 Max (16-core CPU, 40-core GPU)',
        'Memória RAM': '64 GB Unificada de alta velocidade',
        'Armazenamento': '2 TB SSD NVMe',
        'Ecrã': '16.2" Liquid Retina XDR (3456x2234)',
        'Teclado': 'Português QWERTY retroiluminado com Touch ID'
      }),
      'approved'
    );
    insertImage.run(12, '/images/products/macbook-pro-m3.jpg', 1, 1);
    insertImage.run(12, '/images/products/hp-elitebook-fleet.jpg', 0, 2);

    insertAuction.run(
      12,
      12,
      3,
      'active',
      18000000, // 180,000 MZN
      20000000,
      21500000, // 215,000 MZN
      500000,   // Increment: 5,000 MZN
      11,
      agoHours(20),
      inMins(55),
      4 // Mariamo leading
    );

    insertBid.run(12, 5, 18500000, 0, agoHours(15));
    insertBid.run(12, 6, 20000000, 0, agoHours(8));
    insertBid.run(12, 4, 21500000, 0, agoHours(2));

    // Watchlist items for user 4 (Mariamo)
    const insertWatch = database.prepare(`INSERT INTO watchlist (user_id, auction_id) VALUES (?, ?)`);
    insertWatch.run(4, 1);
    insertWatch.run(4, 2);
    insertWatch.run(4, 3);
    insertWatch.run(4, 7);

    // Watchlist items for user 5 (Carlos)
    insertWatch.run(5, 2);
    insertWatch.run(5, 4);
    insertWatch.run(5, 8);

    // Notifications for Mariamo
    const insertNotif = database.prepare(`
      INSERT INTO notifications (user_id, title, message, type, is_read, link)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertNotif.run(
      4,
      'Liderança Confirmada no Lote #1',
      'A sua licitação fiduciária no Porsche 911 GT3 RS (18.450.000 MZN) lidera atualmente o leilão com reserva atingida.',
      'bid_placed',
      0,
      '/auctions/1'
    );
    insertNotif.run(
      4,
      'Disputa Crítica nos Minutos Finais',
      'O leilão do BMW M4 Competition Coupé termina dentro de 18 minutos. Consulte a sala ao vivo!',
      'outbid_warning',
      0,
      '/auctions/2'
    );
    insertNotif.run(
      4,
      'Lance Superado no Toyota Land Cruiser',
      'Carlos Alberto Tembe submeteu uma oferta superior de 8.100.000 MZN no Toyota Land Cruiser 300 ZX.',
      'outbid',
      1,
      '/auctions/4'
    );

    // Notifications for Carlos
    insertNotif.run(
      5,
      'Licitador Líder no Lote #2',
      'A sua oferta de 4.950.000 MZN no BMW M4 Competition Coupé é a mais alta registada.',
      'bid_placed',
      0,
      '/auctions/2'
    );

    // Seed Completed Order for demonstration
    const insertOrder = database.prepare(`
      INSERT INTO orders (id, auction_id, buyer_id, seller_id, total_amount, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const insertPayment = database.prepare(`
      INSERT INTO payments (order_id, user_id, amount, method, status, reference, phone_number)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const insertDelivery = database.prepare(`
      INSERT INTO deliveries (order_id, tracking_number, status, carrier, delivery_address, estimated_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertOrder.run(101, 12, 4, 3, 21500000, 'paid');
    insertPayment.run(101, 4, 21500000, 'm-pesa', 'completed', 'MPESA-TX-98234190-MZ', '+258845556677');
    insertDelivery.run(101, 'MZB-EXP-849204-MAPUTO', 'in_transit', 'MozBid Transporte de Segurança Notarial', 'Avenida Friedrich Engels, n.º 450, Polana Cimento, Maputo', inDays(2));

    // Audit logs
    const insertAudit = database.prepare(`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertAudit.run(4, 'PLACE_BID', 'auction', 1, 'Licitação de 18,450,000 MZN apresentada com custódia fiduciária BCI', '197.249.12.4');
    insertAudit.run(5, 'PLACE_BID', 'auction', 2, 'Licitação de 4,950,000 MZN apresentada com custódia Millennium BIM', '197.249.12.89');
    insertAudit.run(2, 'CREATE_AUCTION', 'auction', 1, 'Lote homologado pelo Conselho de Administração para Porsche 911 GT3 RS', '105.234.88.10');
  });

  console.log('[SQLite] Database successfully seeded with 12 institutional luxury auctions, authentic Mozambican specs and local images!');
}

if (process.argv[1] === new URL(import.meta.url).pathname || process.argv[1] === fileURLToPath(import.meta.url)) {
  seed();
}
