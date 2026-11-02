import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import {
  connectMongoDB,
  User,
  Category,
  Product,
  Auction,
  Bid,
  AutoBid,
  Watchlist,
  Order,
  Payment,
  Delivery,
  Notification,
  AuditLog,
  Counter
} from '../models/index.js';

export async function seedMongoDatabase() {
  console.log('[MongoDB] Starting database seeding...');
  await connectMongoDB();

  // Clear existing collections
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Auction.deleteMany({}),
    Bid.deleteMany({}),
    AutoBid.deleteMany({}),
    Watchlist.deleteMany({}),
    Order.deleteMany({}),
    Payment.deleteMany({}),
    Delivery.deleteMany({}),
    Notification.deleteMany({}),
    AuditLog.deleteMany({}),
    Counter.deleteMany({})
  ]);

  // Set sequence counters safely above seeded records
  await Counter.create([
    { _id: 'users', seq: 10 },
    { _id: 'categories', seq: 10 },
    { _id: 'products', seq: 20 },
    { _id: 'auctions', seq: 20 },
    { _id: 'bids', seq: 100 },
    { _id: 'orders', seq: 200 },
    { _id: 'payments', seq: 300 },
    { _id: 'deliveries', seq: 400 },
    { _id: 'notifications', seq: 500 },
    { _id: 'audit_logs', seq: 600 }
  ]);

  const salt = bcrypt.genSaltSync(10);
  const defaultPasswordHash = bcrypt.hashSync('MozBid@2025!', salt);

  // 1. Seed Categories
  const categoriesData = [
    { id: 1, name: 'Automóveis & Colecionáveis', slug: 'automoveis-motos', description: 'Veículos executivos, supercarros e viaturas homologadas', icon: 'directions_car', display_order: 1 },
    { id: 2, name: 'Maquinaria Pesada & Mineração', slug: 'maquinas-industriais', description: 'Equipamento pesado para construção civil e mineração', icon: 'precision_manufacturing', display_order: 2 },
    { id: 3, name: 'Tecnologia & Servidores', slug: 'tecnologia-computadores', description: 'Equipamento informático corporativo e infraestrutura de TI', icon: 'devices', display_order: 3 },
    { id: 4, name: 'Relógios & Alta Joalharia', slug: 'relogios-joias', description: 'Peças raras com certificação notarial de proveniência', icon: 'watch', display_order: 4 },
    { id: 5, name: 'Imobiliário & Concessões', slug: 'imobiliario-terrenos', description: 'Propriedades comerciais, armazéns portuários e escritórios', icon: 'domain', display_order: 5 },
    { id: 6, name: 'Arte & Património Cultural', slug: 'arte-colecionaveis', description: 'Obras de arte contemporânea moçambicana e esculturas', icon: 'palette', display_order: 6 }
  ];
  await Category.insertMany(categoriesData);
  console.log('[MongoDB] Seeded 6 official categories.');

  // 2. Seed Institutional Users
  const usersData = [
    {
      id: 1,
      name: 'Mesa de Administração MozBid',
      email: 'administracao@mozbid.co.mz',
      phone: '+258 84 000 0001',
      password_hash: defaultPasswordHash,
      role: 'admin',
      is_verified: true,
      balance: 1000000000,
      city: 'Maputo Cidade',
      province: 'Maputo Cidade'
    },
    {
      id: 2,
      name: 'AutoLux Moçambique Sociedade Unipessoal Lda',
      email: 'comercial@autolux.co.mz',
      phone: '+258 84 300 0002',
      password_hash: defaultPasswordHash,
      role: 'seller',
      is_verified: true,
      balance: 450000000,
      city: 'Maputo Cidade',
      province: 'Maputo Cidade',
      nuit: '400192837',
      company_name: 'AutoLux Moçambique Sociedade Unipessoal Lda',
      business_type: 'company',
      verified_status: 'verified',
      rating: 4.98,
      total_sales: 48,
      bank_name: 'Banco Comercial e de Investimentos (BCI)',
      iban_or_account: '0001.0000.12345678901.23'
    },
    {
      id: 3,
      name: 'Consórcio Mineiro Cossa & Associados',
      email: 'consorcio@cossa.co.mz',
      phone: '+258 84 200 0003',
      password_hash: defaultPasswordHash,
      role: 'seller',
      is_verified: true,
      balance: 750000000,
      city: 'Moatize',
      province: 'Tete',
      nuit: '400812944',
      company_name: 'Consórcio Mineiro Cossa & Associados',
      business_type: 'company',
      verified_status: 'verified',
      rating: 4.95,
      total_sales: 32,
      bank_name: 'Millennium BIM',
      iban_or_account: '0003.0000.98765432101.45'
    },
    {
      id: 4,
      name: 'Dra. Mariamo Nhantumbo',
      email: 'mariamo.nhantumbo@advocacia.co.mz',
      phone: '+258 84 555 6677',
      password_hash: defaultPasswordHash,
      role: 'buyer',
      is_verified: true,
      balance: 250000000, // 2.500.000 MZN in escrow
      city: 'Maputo Cidade',
      province: 'Maputo Cidade'
    },
    {
      id: 5,
      name: 'Eng. Carlos Alberto Tembe',
      email: 'carlos.tembe@engenharia.co.mz',
      phone: '+258 82 333 4455',
      password_hash: defaultPasswordHash,
      role: 'buyer',
      is_verified: true,
      balance: 180000000, // 1.800.000 MZN in escrow
      city: 'Matola',
      province: 'Maputo Província'
    },
    {
      id: 6,
      name: 'Dr. Rui de Carvalho',
      email: 'rui.carvalho@investimentos.co.mz',
      phone: '+258 86 999 8877',
      password_hash: defaultPasswordHash,
      role: 'buyer',
      is_verified: true,
      balance: 320000000, // 3.200.000 MZN in escrow
      city: 'Beira',
      province: 'Sofala'
    }
  ];
  await User.insertMany(usersData);
  console.log('[MongoDB] Seeded institutional user accounts.');

  // 3. Seed Products and Auctions with Local Images
  const productsData = [
    {
      id: 1,
      seller_id: 2,
      category_id: 1,
      title: 'Porsche 911 GT3 RS Clubsport 2023 — Pacote Weissach Carbono',
      description: 'Exemplar irrepreensível em Cinzento Ágata com elementos aerodinâmicos em fibra de carbono exposta. Motor Boxer 4.0L atmosférico de 6 cilindros capaz de atingir 9.000 rpm e 525 cv de potência pura, transmissão PDK de dupla embraiagem com 7 velocidades calibrada para pista, travões carbono-cerâmicos PCCB com pinças amarelas e roll-cage homologado FIA. Importação oficial com todos os direitos aduaneiros liquidados pelas Alfândegas de Maputo e registo no INATTER.',
      brand: 'Porsche',
      model: '911 GT3 RS Clubsport (992)',
      year: 2023,
      condition: 'used_like_new',
      mileage_or_hours: '4,850 km',
      fuel_type: 'Gasolina 98 Octanas',
      transmission: 'PDK 7 Velocidades Sequencial',
      location_province: 'Maputo Cidade',
      location_city: 'Entreposto Aduaneiro do Porto de Maputo',
      vin: 'WP0ZZZ99ZPS291823',
      specifications: {
        'Número de Chassi / VIN': 'WP0ZZZ99ZPS291823',
        'Motor': '4.0L Boxer 6 Cilindros Atmosférico (525 cv / 465 Nm)',
        'Velocidade Máxima': '296 km/h (0-100 km/h em 3.2s)',
        'Desembaraço Aduaneiro': 'DUA n.º 2024/04192/MP — Direitos Pagos na Totalidade',
        'Livrete Nacional': 'Livrete e Título de Registo Automóvel Emitido (INATTER Maputo)',
        'Custódia Fiduciária': 'Garantia Bancária Segregada no Banco Comercial e de Investimentos (BCI)'
      },
      images: [
        { image_url: '/images/products/porsche-911-gt3rs.jpg', is_primary: true, display_order: 1 },
        { image_url: '/images/products/bmw-m4-competition.jpg', is_primary: false, display_order: 2 }
      ]
    },
    {
      id: 2,
      seller_id: 2,
      category_id: 1,
      title: 'BMW M4 Competition Coupé 2023 — M xDrive 510cv',
      description: 'Desportivo de alta performance com tração integral inteligente M xDrive comutável para tração traseira. Motor 3.0L TwinPower Turbo de 6 cilindros em linha, 510 cv, caixa M Steptronic de 8 velocidades com Drivelogic. Teto em fibra de carbono, acabamentos interiores em pele Merino Silverstone e sistema de escape M Sport. Documentação notarial 100% regularizada na Conservatória de Maputo.',
      brand: 'BMW',
      model: 'M4 Competition Coupé G82',
      year: 2023,
      condition: 'used_like_new',
      mileage_or_hours: '11,200 km',
      fuel_type: 'Gasolina 95/98 Octanas',
      transmission: 'M Steptronic 8 Velocidades',
      location_province: 'Maputo Cidade',
      location_city: 'Maputo (Polana Cimento)',
      vin: 'WBA33AZ05PFP18294',
      specifications: {
        'Número de Chassi / VIN': 'WBA33AZ05PFP18294',
        'Motor': '3.0L 6 Cilindros TwinPower Turbo (510 cv / 650 Nm)',
        'Desembaraço Aduaneiro': 'DUA n.º 2023/11832/MP — Homologação Concluída'
      },
      images: [
        { image_url: '/images/products/bmw-m4-competition.jpg', is_primary: true, display_order: 1 },
        { image_url: '/images/products/porsche-911-gt3rs.jpg', is_primary: false, display_order: 2 }
      ]
    },
    {
      id: 3,
      seller_id: 3,
      category_id: 2,
      title: 'Escavadora Hidráulica Caterpillar 320 Next Gen 2022',
      description: 'Equipamento de terraplenagem e mineração de alto rendimento com tecnologia Cat Grade 2D integrada de fábrica, balde de 1.19 m³ de capacidade e motor Cat C4.4 ACERT de 158 cv em conformidade com as normas internacionais de emissão. Histórico de manutenção certificado pela Barloworld Moçambique com todas as revisões periódicas carimbadas. Pronta para operação imediata nas bacias de Moatize ou Palma.',
      brand: 'Caterpillar',
      model: '320 Next Generation',
      year: 2022,
      condition: 'used_good',
      mileage_or_hours: '2,840 Horas',
      fuel_type: 'Diesel 50ppm',
      transmission: 'Hidrostática de Alta Pressão',
      location_province: 'Tete',
      location_city: 'Bacia de Moatize, Tete',
      vin: 'CAT0320CGHEX19482',
      specifications: {
        'Número de Série': 'CAT0320CGHEX19482',
        'Peso Operacional': '22.500 kg',
        'Capacidade do Balde': '1.19 m³ Reforçado para Rocha'
      },
      images: [
        { image_url: '/images/products/cat-320-excavator.jpg', is_primary: true, display_order: 1 },
        { image_url: '/images/products/komatsu-d65.jpg', is_primary: false, display_order: 2 }
      ]
    },
    {
      id: 4,
      seller_id: 2,
      category_id: 1,
      title: 'Toyota Land Cruiser 300 ZX 3.3D V6 Twin-Turbo 2023',
      description: 'O topo de gama absoluto da Toyota para expedição executiva e segurança. Motor V6 3.3L Twin-Turbo Diesel de 309 cv e binário massivo de 700 Nm, transmissão automática de 10 velocidades Direct Shift e suspensão variável adaptativa (AVS). Equipado com teto de abrir panorâmico, sistema de som JBL Synthesis com 14 colunas e câmara Multi-Terrain Monitor 360° com visão de solo. Homologado pelo INATTER com matrícula nacional MZ.',
      brand: 'Toyota',
      model: 'Land Cruiser 300 ZX',
      year: 2023,
      condition: 'used_like_new',
      mileage_or_hours: '9,400 km',
      fuel_type: 'Diesel Premium',
      transmission: 'Automática 10 Velocidades',
      location_province: 'Maputo Província',
      location_city: 'Matola',
      vin: 'JTMHX01J804019284',
      specifications: {
        'Número de Chassi / VIN': 'JTMHX01J804019284',
        'Motor': '3.3L V6 Twin-Turbo Diesel (309 cv / 700 Nm)',
        'Tração': 'Integral Permanente 4WD com Bloqueio de Diferencial Traseiro'
      },
      images: [
        { image_url: '/images/products/land-cruiser-300.jpg', is_primary: true, display_order: 1 },
        { image_url: '/images/products/hilux-legend-rs.jpg', is_primary: false, display_order: 2 }
      ]
    },
    {
      id: 5,
      seller_id: 3,
      category_id: 2,
      title: 'Grupo Gerador Cummins QSK23-G3 1000 kVA Insonorizado',
      description: 'Solução industrial robusta para suporte contínuo de energia em infraestruturas hospitalares, bancárias ou complexos mineiros. Motor diesel Cummins QSK23 de 6 cilindros em linha turboalimentado com alternador Stamford de 1000 kVA / 800 kW em regime Prime Power. Canópia com isolamento acústico para 75 dBA a 7 metros, painel de controlo digital Deep Sea Electronics DSE7320 e depósito de combustível integrado de 1.500 litros.',
      brand: 'Cummins Power Generation',
      model: 'C1000D5B (QSK23-G3)',
      year: 2023,
      condition: 'new',
      mileage_or_hours: '48 Horas (Testes de Arranque)',
      fuel_type: 'Diesel Industrial',
      transmission: 'Acoplamento Direto SAE 0/18',
      location_province: 'Maputo Província',
      location_city: 'Parque Industrial de Beluluane (Matola)',
      vin: 'CUM-GEN-2023-QSK1000',
      specifications: {
        'Potência Nominal': '1000 kVA (Standby) / 900 kVA (Prime)',
        'Painel de Controlo': 'Deep Sea Electronics DSE7320 MKII com Monitorização Remota'
      },
      images: [
        { image_url: '/images/products/cummins-generator.jpg', is_primary: true, display_order: 1 },
        { image_url: '/images/products/cat-320-excavator.jpg', is_primary: false, display_order: 2 }
      ]
    },
    {
      id: 6,
      seller_id: 2,
      category_id: 1,
      title: 'Mercedes-AMG G63 Mansory Edition 2024 — V8 BiTurbo 850cv',
      description: 'Super-SUV de colecionador construído pela preparadora de elite Mansory sobre o icónico Mercedes-AMG G63. Motor 4.0L V8 BiTurbo recalibrado para 850 cv e 1.000 Nm de binário, capô ventilado em carbono forjado, kit aerodinâmico widebody completo e jantes forjadas de 24 polegadas. Interior totalmente forrado a pele Mandarin Orange e carbono mate. Certificado de autenticidade Mansory com número de série gravado em ouro de 18 quilates.',
      brand: 'Mercedes-Benz / Mansory',
      model: 'AMG G63 Mansory Gronos 2024',
      year: 2024,
      condition: 'used_like_new',
      mileage_or_hours: '1,800 km',
      fuel_type: 'Gasolina 98 Octanas',
      transmission: 'AMG SPEEDSHIFT TCT 9G',
      location_province: 'Maputo Cidade',
      location_city: 'Polana Cimento, Maputo',
      vin: 'W1N4632761X948172',
      specifications: {
        'Número de Chassi / VIN': 'W1N4632761X948172',
        'Potência': '850 cv / 1.000 Nm',
        'Aceleração 0-100 km/h': '3.5 segundos'
      },
      images: [
        { image_url: '/images/products/mercedes-amg-g63.jpg', is_primary: true, display_order: 1 },
        { image_url: '/images/products/bmw-m4-competition.jpg', is_primary: false, display_order: 2 }
      ]
    },
    {
      id: 7,
      seller_id: 2,
      category_id: 4,
      title: 'Rolex Submariner Date 41mm Ouro Branco & Bisel Azul (Ref. 126619LB)',
      description: 'Relógio de mergulho de alta relojoaria manufaturado em ouro branco maciço de 18 quilates com disco de luneta Cerachrom azul royal inalterável e mostrador preto lacado. Calibre 3235 de manufatura Rolex com escape Chronergy e 70 horas de reserva de marcha. Acompanhado pelo conjunto completo original (estojo verde oficial, certificado de garantia eletrónica internacional Rolex e elos suplementares). Proveniência notarial autenticada na Suíça.',
      brand: 'Rolex',
      model: 'Submariner Date Ref. 126619LB',
      year: 2023,
      condition: 'used_like_new',
      mileage_or_hours: 'Sem Marcas de Uso',
      fuel_type: 'Mecânico Automático (Calibre 3235)',
      transmission: 'Bracelete Oysterlock Ouro Branco com Glidelock',
      location_province: 'Maputo Cidade',
      location_city: 'Avenida Julius Nyerere, Polana, Maputo',
      vin: 'ROL-SUB-126619LB-9182',
      specifications: {
        'Referência Oficial': '126619LB',
        'Material da Caixa': 'Ouro Branco 18k com Bisel Cerachrom Cerâmica Azul',
        'Diâmetro': '41 mm'
      },
      images: [
        { image_url: '/images/products/rolex-submariner.jpg', is_primary: true, display_order: 1 },
        { image_url: '/images/products/patek-philippe.jpg', is_primary: false, display_order: 2 }
      ]
    },
    {
      id: 8,
      seller_id: 2,
      category_id: 4,
      title: 'Patek Philippe Aquanaut Chronograph 5968G Ouro Branco Azul Noite',
      description: 'Cronógrafo desportivo de alta complicação em ouro branco de 18 quilates com mostrador degradé azul noite e padrão axadrezado Aquanaut. Movimento mecânico de corda automática com cronógrafo flyback Calibre CH 28-520 C com rotor central em ouro de 21 quilates. Fornecido com duas braceletes originais em material compósito ultra-resistente (azul noite e preta) e fecho de báscula patenteado Patek Philippe em ouro branco.',
      brand: 'Patek Philippe',
      model: 'Aquanaut Chronograph Ref. 5968G-001',
      year: 2022,
      condition: 'used_like_new',
      mileage_or_hours: 'Estado de Colecionador',
      fuel_type: 'Mecânico Automático (Calibre CH 28-520 C)',
      transmission: 'Fecho Dobrável Patenteado Aquanaut',
      location_province: 'Maputo Cidade',
      location_city: 'Polana Cimento, Maputo',
      vin: 'PP-AQUA-5968G-2022-01',
      specifications: {
        'Referência Oficial': '5968G-001',
        'Movimento': 'Cronógrafo Flyback Automático Calibre CH 28-520 C',
        'Diâmetro': '42.2 mm'
      },
      images: [
        { image_url: '/images/products/patek-philippe.jpg', is_primary: true, display_order: 1 },
        { image_url: '/images/products/rolex-submariner.jpg', is_primary: false, display_order: 2 }
      ]
    },
    {
      id: 9,
      seller_id: 3,
      category_id: 2,
      title: 'Buldózer de Rastos Komatsu D65EX-18 para Mineração',
      description: 'Trator de esteiras de alta produtividade equipado com lâmina SIGMADOZER de 5.61 m³ e ripper traseiro de paralelogramo multidentes. Motor Komatsu SAA6D114E-6 de 217 cv com sistema automático de bloqueio do conversor de binário para redução de até 10% no consumo de combustível. Cabine ROPS/FOPS pressurizada com ar condicionado de alto débito e assento de suspensão pneumática para condições extremas em Moçambique.',
      brand: 'Komatsu',
      model: 'D65EX-18 Heavy Duty',
      year: 2021,
      condition: 'used_good',
      mileage_or_hours: '3,420 Horas',
      fuel_type: 'Diesel 50ppm',
      transmission: 'TORQFLOW Planetária de 3 Velocidades',
      location_province: 'Tete',
      location_city: 'Bacia Carbonífera de Moatize, Tete',
      vin: 'KOM-D65EX18-91823',
      specifications: {
        'Peso Operacional': '21.500 kg',
        'Capacidade da Lâmina': '5.61 m³ SIGMADOZER',
        'Potência Líquida': '217 cv @ 1.950 rpm'
      },
      images: [
        { image_url: '/images/products/komatsu-d65.jpg', is_primary: true, display_order: 1 },
        { image_url: '/images/products/cat-320-excavator.jpg', is_primary: false, display_order: 2 }
      ]
    },
    {
      id: 10,
      seller_id: 2,
      category_id: 1,
      title: 'Toyota Hilux 2.8 GD-6 4x4 Double Cab Legend RS 2022',
      description: 'A pick-up de referência em durabilidade e prestígio no mercado moçambicano. Versão topo de gama Legend RS com persiana de caixa traseira elétrica (Roller Shutter), acabamento exterior bitom com proteções pretas acetinadas e interior em pele preta perfurada com iluminação ambiente em azul. Motor 2.8L turbo diesel de 204 cv e 500 Nm, tração 4x4 comutável com bloqueio de diferencial e sistema multimédia com Apple CarPlay e Android Auto.',
      brand: 'Toyota',
      model: 'Hilux 2.8 GD-6 Legend RS 4x4',
      year: 2022,
      condition: 'used_like_new',
      mileage_or_hours: '28,600 km',
      fuel_type: 'Diesel 50ppm',
      transmission: 'Automática 6 Velocidades',
      location_province: 'Sofala',
      location_city: 'Porto da Beira, Sofala',
      vin: 'AHTBB3CD201948271',
      specifications: {
        'Número de Chassi / VIN': 'AHTBB3CD201948271',
        'Motor': '2.8L 4 Cilindros Turbo Diesel (204 cv / 500 Nm)',
        'Carga Útil': '1.000 kg + Capacidade de Reboque de 3.500 kg'
      },
      images: [
        { image_url: '/images/products/hilux-legend-rs.jpg', is_primary: true, display_order: 1 },
        { image_url: '/images/products/land-cruiser-300.jpg', is_primary: false, display_order: 2 }
      ]
    },
    {
      id: 11,
      seller_id: 2,
      category_id: 3,
      title: 'Lote Corporativo: 10x Apple MacBook Pro 16" M3 Max 64GB / 1TB SSD',
      description: 'Lote homogéneo de 10 estações portáteis topo de gama para estúdios de arquitetura, desenvolvimento de software e análise financeira. Cada unidade vem equipada com o processador M3 Max (CPU de 16 núcleos, GPU de 40 núcleos e Neural Engine de 16 núcleos), 64 GB de memória unificada de alta velocidade e disco SSD de 1 TB. Ecrã Liquid Retina XDR de 16.2 polegadas com tecnologia ProMotion 120Hz. Todas as unidades na caixa original lacrada com garantia internacional Apple Care.',
      brand: 'Apple',
      model: 'MacBook Pro 16" M3 Max (Space Black)',
      year: 2024,
      condition: 'new',
      mileage_or_hours: 'Novos em Caixa Lacrada',
      fuel_type: 'Bateria 100 Wh com Carregador MagSafe 140W',
      transmission: 'Teclado Magic Keyboard com Touch ID',
      location_province: 'Maputo Cidade',
      location_city: 'Centro Empresarial de Maputo (Polana)',
      vin: 'APP-MBP16-M3MAX-LOT10',
      specifications: {
        'Quantidade no Lote': '10 Portáteis Homogéneos',
        'Processador': 'Apple M3 Max (CPU 16-Core / GPU 40-Core)',
        'Memória RAM': '64 GB de Memória Unificada por unidade',
        'Armazenamento': '1 TB SSD PCIe de Alta Velocidade por unidade'
      },
      images: [
        { image_url: '/images/products/macbook-pro-m3.jpg', is_primary: true, display_order: 1 },
        { image_url: '/images/products/hp-elitebook-fleet.jpg', is_primary: false, display_order: 2 }
      ]
    },
    {
      id: 12,
      seller_id: 2,
      category_id: 3,
      title: 'Frota Corporativa TI: 25x HP EliteBook 840 G10 Intel Core i7 32GB',
      description: 'Lote completo de 25 portáteis empresariais da série premium HP EliteBook 840 G10 concebidos para equipas corporativas e bancárias. Processador Intel Core i7-1365U vPro de 10 núcleos, 32 GB de memória RAM DDR5 a 5200 MHz, 512 GB SSD NVMe Opal2 com encriptação por hardware. Chassi unibody em alumínio com certificação de resistência militar MIL-STD-810H, câmara IR de 5MP com reconhecimento facial Windows Hello e leitor de smart card integrado.',
      brand: 'HP',
      model: 'EliteBook 840 G10 Enterprise',
      year: 2023,
      condition: 'used_like_new',
      mileage_or_hours: 'Sem Marcas de Uso / Baterias a 100%',
      fuel_type: 'Bateria HP Long Life 3 Células 51Wh',
      transmission: 'Teclado Resistente a Salpicos com Retroiluminação',
      location_province: 'Maputo Cidade',
      location_city: 'Maputo Cidade',
      vin: 'HP-EB840G10-LOT25',
      specifications: {
        'Quantidade': '25 Computadores Portáteis',
        'Processador': 'Intel Core i7-1365U vPro (até 5.2 GHz)',
        'Memória e Disco': '32 GB DDR5 RAM + 512 GB NVMe SSD',
        'Segurança': 'HP Wolf Security + TPM 2.0 + Leitor de SmartCard'
      },
      images: [
        { image_url: '/images/products/hp-elitebook-fleet.jpg', is_primary: true, display_order: 1 },
        { image_url: '/images/products/macbook-pro-m3.jpg', is_primary: false, display_order: 2 }
      ]
    }
  ];
  await Product.insertMany(productsData);
  console.log('[MongoDB] Seeded 12 institutional luxury products with local images.');

  // 4. Seed Auctions
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;

  const auctionsData = [
    {
      id: 1,
      product_id: 1,
      seller_id: 2,
      status: 'active',
      starting_price: 1650000000, // 16.500.000 MT
      reserve_price: 1800000000, // 18.000.000 MT
      current_price: 1855000000, // 18.550.000 MT
      bid_increment: 10000000,   // 100.000 MT
      bid_count: 39,
      starts_at: new Date(now - 2 * day),
      ends_at: new Date(now + 4 * hour),
      winner_id: 5, // Eng. Carlos Tembe
      auto_extend_count: 0
    },
    {
      id: 2,
      product_id: 2,
      seller_id: 2,
      status: 'active',
      starting_price: 420000000,
      reserve_price: 480000000,
      current_price: 495000000,
      bid_increment: 5000000,
      bid_count: 14,
      starts_at: new Date(now - day),
      ends_at: new Date(now + 18 * 60 * 1000), // Termina em 18 minutos!
      winner_id: 4, // Dra. Mariamo
      auto_extend_count: 0
    },
    {
      id: 3,
      product_id: 3,
      seller_id: 3,
      status: 'active',
      starting_price: 850000000,
      reserve_price: 950000000,
      current_price: 980000000,
      bid_increment: 10000000,
      bid_count: 22,
      starts_at: new Date(now - 3 * day),
      ends_at: new Date(now + 28 * 60 * 1000), // Termina em 28 minutos!
      winner_id: 5,
      auto_extend_count: 0
    },
    {
      id: 4,
      product_id: 4,
      seller_id: 2,
      status: 'active',
      starting_price: 750000000,
      reserve_price: 800000000,
      current_price: 810000000,
      bid_increment: 5000000,
      bid_count: 18,
      starts_at: new Date(now - day),
      ends_at: new Date(now + 48 * 60 * 1000), // Termina em 48 minutos!
      winner_id: 6, // Dr. Rui
      auto_extend_count: 0
    },
    {
      id: 5,
      product_id: 5,
      seller_id: 3,
      status: 'active',
      starting_price: 380000000,
      reserve_price: 420000000,
      current_price: 435000000,
      bid_increment: 5000000,
      bid_count: 9,
      starts_at: new Date(now - 2 * day),
      ends_at: new Date(now + 3 * day),
      winner_id: 5,
      auto_extend_count: 0
    },
    {
      id: 6,
      product_id: 6,
      seller_id: 2,
      status: 'active',
      starting_price: 2200000000,
      reserve_price: 2400000000,
      current_price: 2470000000,
      bid_increment: 10000000,
      bid_count: 42,
      starts_at: new Date(now - 4 * day),
      ends_at: new Date(now + 2 * day),
      winner_id: 4,
      auto_extend_count: 0
    },
    {
      id: 7,
      product_id: 7,
      seller_id: 2,
      status: 'active',
      starting_price: 250000000,
      reserve_price: 280000000,
      current_price: 295000000,
      bid_increment: 2500000,
      bid_count: 27,
      starts_at: new Date(now - day),
      ends_at: new Date(now + 5 * hour),
      winner_id: 6,
      auto_extend_count: 0
    },
    {
      id: 8,
      product_id: 8,
      seller_id: 2,
      status: 'active',
      starting_price: 480000000,
      reserve_price: 520000000,
      current_price: 540000000,
      bid_increment: 5000000,
      bid_count: 31,
      starts_at: new Date(now - 2 * day),
      ends_at: new Date(now + 1 * day),
      winner_id: 4,
      auto_extend_count: 0
    },
    {
      id: 9,
      product_id: 9,
      seller_id: 3,
      status: 'active',
      starting_price: 680000000,
      reserve_price: 750000000,
      current_price: 765000000,
      bid_increment: 5000000,
      bid_count: 12,
      starts_at: new Date(now - 3 * day),
      ends_at: new Date(now + 4 * day),
      winner_id: 5,
      auto_extend_count: 0
    },
    {
      id: 10,
      product_id: 10,
      seller_id: 2,
      status: 'active',
      starting_price: 260000000,
      reserve_price: 290000000,
      current_price: 295000000,
      bid_increment: 2500000,
      bid_count: 15,
      starts_at: new Date(now - day),
      ends_at: new Date(now + 6 * hour),
      winner_id: 4,
      auto_extend_count: 0
    },
    {
      id: 11,
      product_id: 11,
      seller_id: 2,
      status: 'active',
      starting_price: 280000000,
      reserve_price: 320000000,
      current_price: 335000000,
      bid_increment: 2500000,
      bid_count: 19,
      starts_at: new Date(now - 2 * day),
      ends_at: new Date(now + 3 * day),
      winner_id: 6,
      auto_extend_count: 0
    },
    {
      id: 12,
      product_id: 12,
      seller_id: 2,
      status: 'active',
      starting_price: 195000000,
      reserve_price: 220000000,
      current_price: 230000000,
      bid_increment: 2000000,
      bid_count: 11,
      starts_at: new Date(now - day),
      ends_at: new Date(now + 5 * day),
      winner_id: 4,
      auto_extend_count: 0
    }
  ];
  await Auction.insertMany(auctionsData);
  console.log('[MongoDB] Seeded 12 institutional luxury auctions.');

  // 5. Seed Bids History for Auction 1 (Porsche 911 GT3 RS)
  const bidsData = [
    { id: 1, auction_id: 1, bidder_id: 5, bidder_name: 'Eng. Carlos Alberto Tembe', amount: 1700000000, is_auto: false, created_at: new Date(now - 28 * hour) },
    { id: 2, auction_id: 1, bidder_id: 6, bidder_name: 'Dr. Rui de Carvalho', amount: 1750000000, is_auto: false, created_at: new Date(now - 20 * hour) },
    { id: 3, auction_id: 1, bidder_id: 4, bidder_name: 'Dra. Mariamo Nhantumbo', amount: 1800000000, is_auto: false, created_at: new Date(now - 12 * hour) },
    { id: 4, auction_id: 1, bidder_id: 5, bidder_name: 'Eng. Carlos Alberto Tembe', amount: 1820000000, is_auto: false, created_at: new Date(now - 6 * hour) },
    { id: 5, auction_id: 1, bidder_id: 4, bidder_name: 'Dra. Mariamo Nhantumbo', amount: 1845000000, is_auto: false, created_at: new Date(now - 1 * hour) },
    { id: 6, auction_id: 1, bidder_id: 5, bidder_name: 'Eng. Carlos Alberto Tembe', amount: 1855000000, is_auto: false, created_at: new Date(now - 10 * 60 * 1000) }
  ];
  await Bid.insertMany(bidsData);

  // 6. Seed Sample Order, Payment, and Notification
  await Order.create({
    id: 101,
    auction_id: 2,
    buyer_id: 4,
    seller_id: 2,
    total_amount: 495000000,
    status: 'paid'
  });

  await Payment.create({
    id: 201,
    order_id: 101,
    amount: 495000000,
    method: 'm-pesa',
    status: 'completed',
    reference: 'MPESA-MZB-918231',
    phone_number: '+258 84 555 6677',
    notes: 'Liquidação fiduciária confirmada'
  });

  await Delivery.create({
    id: 301,
    order_id: 101,
    status: 'shipped',
    tracking_number: 'MZB-EXP-918231',
    courier_name: 'Logística Blindada MozBid Maputo',
    address: 'Av. Friedrich Engels, Polana, Maputo',
    estimated_delivery: new Date(now + 2 * day)
  });

  await Notification.create([
    {
      id: 401,
      user_id: 4,
      title: 'Disputa de Lote em Curso',
      message: 'O seu lance no Lote #2 (BMW M4 Competition) permanece como a oferta líder.',
      type: 'bid_placed',
      is_read: false,
      link: '/auctions/2'
    },
    {
      id: 402,
      user_id: 4,
      title: 'Caução em Escrow Ativa',
      message: 'Garantia de 2.500.000 MZN custodiada no Millennium BIM para cobertura licitatória.',
      type: 'payment_received',
      is_read: true,
      link: '/buyer/dashboard'
    }
  ]);

  await AuditLog.create([
    {
      id: 501,
      user_id: 1,
      user_name: 'Mesa de Administração MozBid',
      action: 'MONGODB_ENGINE_INITIALIZED',
      details: 'Base de dados transacional MongoDB inicializada com 12 leilões homologados.',
      ip_address: '127.0.0.1'
    }
  ]);

  console.log('[MongoDB] ✓ All collections seeded successfully with 0 test credentials displayed on UI!');
}

// If run directly via node
if (process.argv[1]?.endsWith('seed-mongo.js')) {
  seedMongoDatabase()
    .then(() => {
      console.log('[MongoDB Seed] Completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[MongoDB Seed Error]', err);
      process.exit(1);
    });
}
