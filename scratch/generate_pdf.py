import sys
import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#777777"))
        
        # Don't draw headers/footers on cover page
        if self._pageNumber > 1:
            # Header
            self.drawString(40, A4[1] - 30, "MOZBID MOÇAMBIQUE • DOSSIER TÉCNICO & MANUAL DE APRESENTAÇÃO")
            self.drawRightString(A4[0] - 40, A4[1] - 30, "LEILÕES FIDUCIÁRIOS EM MZN")
            self.setStrokeColor(colors.HexColor("#E8E3DA"))
            self.setLineWidth(0.5)
            self.line(40, A4[1] - 34, A4[0] - 40, A4[1] - 34)

            # Footer
            self.setStrokeColor(colors.HexColor("#E8E3DA"))
            self.setLineWidth(0.5)
            self.line(40, 36, A4[0] - 40, 36)
            self.drawString(40, 24, "CONFIDENCIAL — USO EXCLUSIVO PARA DEMONSTRAÇÃO E TESTES HOMOLOGADOS")
            page_text = f"Página {self._pageNumber} de {page_count}"
            self.drawRightString(A4[0] - 40, 24, page_text)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=45,
        bottomMargin=45
    )

    styles = getSampleStyleSheet()

    # Custom styles
    gold = colors.HexColor("#B69A68")
    dark = colors.HexColor("#171717")
    gold_light = colors.HexColor("#FAF8F5")
    border_color = colors.HexColor("#E8E3DA")

    title_cover = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=dark,
        spaceAfter=8
    )

    subtitle_cover = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=18,
        textColor=colors.HexColor("#666666"),
        spaceAfter=20
    )

    h1_style = ParagraphStyle(
        'Heading1Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=22,
        textColor=dark,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#8C734B"),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14.5,
        textColor=colors.HexColor("#222222"),
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=14,
        textColor=colors.HexColor("#333333"),
        leftIndent=15,
        spaceAfter=4
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=14,
        textColor=colors.HexColor("#444444")
    )

    badge_style = ParagraphStyle(
        'Badge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=dark,
        alignment=1
    )

    story = []

    # ==================== COVER PAGE ====================
    story.append(Spacer(1, 40))
    story.append(Paragraph("MOÇAMBIQUE • LEILÕES SELECCIONADOS", ParagraphStyle(
        'CoverTop', fontName='Helvetica-Bold', fontSize=10, leading=14, textColor=gold, spaceAfter=15
    )))
    story.append(Paragraph("MOZBID", ParagraphStyle(
        'CoverBigBrand', fontName='Helvetica-Bold', fontSize=44, leading=48, textColor=dark, spaceAfter=4
    )))
    story.append(Paragraph("Bolsa Digital Soberana de Leilões em Meticais (MZN)", title_cover))
    
    story.append(HRFlowable(width="100%", thickness=2, color=gold, spaceBefore=10, spaceAfter=15))
    
    story.append(Paragraph(
        "<b>Dossier Técnico Executivo, Especificação Funcional, Arquitectura Tecnológica e Roteiro Oficial de Apresentação</b>",
        subtitle_cover
    ))

    # Summary Meta Box
    meta_data = [
        [Paragraph("<b>Documento:</b> Manual de Sistema & Guia de Homologação", body_style),
         Paragraph("<b>Versão da Plataforma:</b> v2.0 (PWA Standalone)", body_style)],
        [Paragraph("<b>Moeda de Liquidação:</b> Meticais Moçambicanos (MZN)", body_style),
         Paragraph("<b>Ambiente:</b> Produção & Demonstração", body_style)],
        [Paragraph("<b>Conformidade Fiscal:</b> NUIT & Custódia Escrow", body_style),
         Paragraph("<b>Data de Emissão:</b> Novembro de 2026", body_style)]
    ]
    meta_table = Table(meta_data, colWidths=[250, 260])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), gold_light),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(meta_table)

    story.append(Spacer(1, 40))
    story.append(Paragraph("<b>Resumo Executivo:</b>", h2_style))
    story.append(Paragraph(
        "O <b>MozBid</b> é a plataforma de leilões e liquidação fiduciária de maior prestígio em Moçambique, "
        "concebida especificamente para transacções de alta confiança de veículos executivos, frotas institucionais, "
        "maquinaria industrial pesada, alta relojoaria e equipamentos tecnológicos corporativos. "
        "O sistema implementa regras estritas de integridade bancária em Meticais (MZN), verificação notarial, "
        "extensão anti-sniping e controlo rigoroso de acesso baseado em credenciais (RBAC).",
        body_style
    ))

    story.append(PageBreak())

    # ==================== SECTION 1: FUNCIONALIDADES ====================
    story.append(Paragraph("1. O Que o Sistema Faz — Funcionalidades Principais", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=gold, spaceBefore=4, spaceAfter=12))

    story.append(Paragraph("1.1. Motor de Pregão e Licitação em Tempo Real", h2_style))
    story.append(Paragraph(
        "A plataforma conecta compradores e vendedores através de WebSockets bidireccionais de ultra-baixa latência (Socket.IO). "
        "Qualquer oferta submetida na sala de leilão é validada por transacções atómicas na base de dados e projectada instantaneamente "
        "em todos os ecrãs activos, exibindo o novo líder, o incremento regulado e o histórico de disputa.",
        body_style
    ))

    story.append(Paragraph("1.2. Mecanismo de Protecção Anti-Sniping", h2_style))
    story.append(Paragraph(
        "Para evitar práticas de manipulação nos últimos segundos (sniping), o sistema aplica a regra institucional: "
        "se uma nova oferta for realizada nos últimos minutos de um lote activo, o cronómetro de encerramento é estendido "
        "automaticamente por mais <b>3 minutos</b> adicionais, garantindo tempo justo de contra-oferta aos concorrentes.",
        body_style
    ))

    story.append(Paragraph("1.3. Contas de Custódia em Escrow e Caução em Meticais (MZN)", h2_style))
    story.append(Paragraph(
        "O MozBid integra uma camada fiduciária na qual cada licitador efectua o depósito prévio de caução. "
        "A caução cobre o valor de garantia exigido pelo regulamento. Caso o comprador seja superado noutro lance, "
        "os fundos mantêm-se protegidos ou são libertados imediatamente. A liquidação final aceita múltiplos canais oficiais:",
        body_style
    ))
    story.append(Paragraph("• <b>M-Pesa (Vodacom Moçambique):</b> Notificação USSD push instantânea com código PIN no telemóvel.", bullet_style))
    story.append(Paragraph("• <b>e-Mola (Movitel Moçambique):</b> Liquidação directa via carteira móvel nacional (*898#).", bullet_style))
    story.append(Paragraph("• <b>Transferência Bancária Auditável:</b> Millennium BIM, BCI, Standard Bank Moçambique com referência fiduciária.", bullet_style))

    story.append(Paragraph("1.4. Controlo Estrito de Acesso Baseado em Perfis (RBAC)", h2_style))
    story.append(Paragraph(
        "<b>Segurança Absoluta:</b> Nenhum utilizador pode alternar ou escolher perfis manualmente. "
        "As credenciais autenticadas no acto de início de sessão determinam com exclusividade o painel e os privilégios atribuídos:",
        body_style
    ))
    story.append(Paragraph("• <b>Comprador (Buyer):</b> Visualiza unicamente o <i>Painel do Comprador</i>, histórico de lances, depósitos de caução e lotes arrematados.", bullet_style))
    story.append(Paragraph("• <b>Vendedor Homologado (Seller):</b> Acede estritamente ao <i>Painel do Vendedor</i> com assistente de publicação de novos produtos e acompanhamento de receita.", bullet_style))
    story.append(Paragraph("• <b>Administrador Central (Admin):</b> Acesso restrito à <i>Administração Central</i> com moderação de pregões, auditoria documental de NUIT e supervisão da bolsa.", bullet_style))

    story.append(Paragraph("1.5. Filtragem Geográfica e Categorias Específicas de Moçambique", h2_style))
    story.append(Paragraph(
        "O catálogo disponibiliza filtros avançados pelas 11 províncias nacionais (Maputo Cidade, Maputo Província, Gaza, Inhambane, Sofala, Manica, Tete, Zambézia, Nampula, Cabo Delgado e Niassa), "
        "e categorias de alto valor: <i>Automóveis & Coleccionáveis, Maquinaria Pesada & Mineração, Tecnologia & Servidores, Relógios & Alta Joalharia, Imobiliário & Concessões e Arte Cultural</i>.",
        body_style
    ))

    story.append(PageBreak())

    # ==================== SECTION 2: TECNOLOGIAS ====================
    story.append(Paragraph("2. Arquitectura & Tecnologias Utilizadas", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=gold, spaceBefore=4, spaceAfter=12))

    tech_data = [
        [Paragraph("<b>Camada</b>", h2_style), Paragraph("<b>Tecnologias Adoptadas</b>", h2_style), Paragraph("<b>Finalidade & Benefício</b>", h2_style)],
        [
            Paragraph("<b>Frontend SPA</b>", body_style),
            Paragraph("Vue 3 (Composition API), TypeScript, Vite 6, Pinia 3", body_style),
            Paragraph("Interface ultra-rápida, tipada de ponta a ponta e reativa em milissegundos.", body_style)
        ],
        [
            Paragraph("<b>Design System</b>", body_style),
            Paragraph("Tailwind CSS, Quasar Framework 2, Lucide Icons", body_style),
            Paragraph("Estética editorial de luxo, grelhas responsivas perfeitas em telemóvel e computador.", body_style)
        ],
        [
            Paragraph("<b>Mobile / PWA</b>", body_style),
            Paragraph("Progressive Web App, Service Worker (sw.js), Web App Manifest", body_style),
            Paragraph("Instalação como aplicação nativa sem necessidade de App Store, offline shell, arranque em ecrã total.", body_style)
        ],
        [
            Paragraph("<b>Persistência de Sessão</b>", body_style),
            Paragraph("JWT (30 Dias), LocalStorage Shield, Auto-Rehydration", body_style),
            Paragraph("O utilizador autentica-se apenas na primeira vez; nas utilizações seguintes é reconhecido automaticamente.", body_style)
        ],
        [
            Paragraph("<b>Backend & API</b>", body_style),
            Paragraph("Node.js 22 LTS, Express.js REST API", body_style),
            Paragraph("Arquitectura modular com rotas protegidas por middleware de autorização RBAC.", body_style)
        ],
        [
            Paragraph("<b>Tempo Real</b>", body_style),
            Paragraph("Socket.IO v4 (WebSockets bidireccionais)", body_style),
            Paragraph("Broadcast instantâneo de novos lances, sincronização de cronómetros e notificações em direto.", body_style)
        ],
        [
            Paragraph("<b>Base de Dados</b>", body_style),
            Paragraph("MongoDB 7+ (Mongoose ODM Soberano)", body_style),
            Paragraph("Persistência robusta NoSQL, alta disponibilidade, auditoria notarial, integridade referencial e transacções atómicas de licitações.", body_style)
        ],
        [
            Paragraph("<b>Segurança</b>", body_style),
            Paragraph("Bcrypt Password Hashing, JWT Bearer, CORS", body_style),
            Paragraph("Criptografia de credenciais, protecção contra acessos indevidos e isolamento de rotas.", body_style)
        ]
    ]

    tech_table = Table(tech_data, colWidths=[100, 190, 225])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), gold_light),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(tech_table)

    story.append(Spacer(1, 15))
    story.append(Paragraph("2.1. Arquitectura PWA e Autenticação Persistente", h2_style))
    story.append(Paragraph(
        "A aplicação implementa as mais recentes directrizes de <b>Progressive Web Apps (PWA)</b>: "
        "ao visitar o MozBid num telemóvel Android, iPhone (iOS) ou computador Windows/Mac, o sistema exibe o convite nativo de instalação. "
        "Uma vez instalado:",
        body_style
    ))
    story.append(Paragraph("1. O ícone oficial do MozBid surge no ecrã de aplicações ou ambiente de trabalho.", bullet_style))
    story.append(Paragraph("2. A janela é executada em modo <b>standalone</b> (ecrã completo, sem barra de URL do navegador).", bullet_style))
    story.append(Paragraph("3. <b>Autenticação Persistente:</b> O token JWT gerado tem validade alargada de 30 dias. "
                           "Ao fechar e reabrir a aplicação, a sessão é preservada de forma transparente, permitindo acesso imediato aos lances e painéis sem solicitar nova senha.", bullet_style))

    story.append(PageBreak())

    # ==================== SECTION 3: ROTEIRO DE APRESENTAÇÃO ====================
    story.append(Paragraph("3. Roteiro de Apresentação Oficial (Passo a Passo)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=gold, spaceBefore=4, spaceAfter=12))
    story.append(Paragraph(
        "Utilize este guião estruturado para conduzir uma demonstração institucional de alto impacto para clientes, parceiros bancários ou investidores:",
        body_style
    ))

    steps = [
        ("Passo 1: Montra Principal e Identidade Editorial",
         "Abra a página inicial (HomePage). Destaque a composição visual de luxo: o logótipo MOZBID MOÇAMBIQUE em serif nobre, o anúncio em destaque (Porsche 911 GT3 RS Clubsport com contornos luminosos), as métricas de confiança (2.4B MZN de volume, 100% de custódia escrow bancária e 14.200+ licitadores), e a barra de pesquisa rápida por província e categoria."),
        
        ("Passo 2: Demonstração da Experiência PWA e Mobile",
         "Redimensione o ecrã para modo telemóvel ou abra no smartphone. Mostre a barra inferior de navegação móvel (Início, Explorar, Registar, Entrar), o banner de instalação instantânea no dispositivo e a ausência de elementos quebrados ou sobrepostos."),
        
        ("Passo 3: Registo de Novo Licitador com NUIT",
         "Clique em 'Criar Conta' / 'Registar'. Mostre o formulário com selecção de tipo de conta (Comprador, Vendedor ou Empresa), validação de número de telefone moçambicano (+258) e indicação do NUIT. Realize um registo ou autentique-se com uma conta de teste."),
        
        ("Passo 4: Demonstração do Controlo Estrito por Credenciais (RBAC)",
         "Inicie sessão com a conta de Administrador (administracao@mozbid.co.mz). Abra o menu superior do perfil e mostre que apenas a opção 'Administração Central' está acessível. Nenhuma outra opção de mudança de perfil é permitida. Em seguida, entre com uma conta de Comprador e mostre o isolamento perfeito para o 'Painel do Comprador'."),
        
        ("Passo 5: Painel do Comprador e Depósito de Caução em Escrow",
         "No Painel do Comprador, clique em 'Depositar Caução Fiduciária'. Seleccione o montante em Meticais (ex: 500.000 MZN) e mostre a integração visual com os canais locais (M-Pesa Vodacom, e-Mola Movitel e Millennium BIM / BCI)."),
        
        ("Passo 6: Disputa de Licitação em Tempo Real ao Vivo",
         "Navegue até um lote activo (ex: Lote #1 — Porsche 911). Abra a página de detalhes. Mostre o relógio em contagem decrescente, o preço de reserva, o incremento mínimo e submeta um lance. Demonstre a actualização imediata sem necessidade de recarregar a página (F5)."),
        
        ("Passo 7: Encerramento do Tempo, Vitória Homologada e Instruções de Levantamento",
         "Quando o tempo estimado expira (ou quando o lote encerra), a plataforma adjudica formalmente o bem ao comprador líder. Surge imediatamente o banner de comemoração em dourado ('🏆 Parabéns! Você Ganhou Este Leilão!') com as instruções detalhadas de levantamento: morada do armazém/entreposto, documentos obrigatórios a apresentar (BI/DIRE e NUIT), vistoria pericial de 120 pontos, contactos do fiel depositário e botão para gerar e imprimir a Guia Oficial de Adjudicação."),

        ("Passo 8: Painel do Vendedor e Publicação Assistida de Lote",
         "Inicie sessão com um Vendedor (comercial@autolux.co.mz). Mostre o assistente passo-a-passo para cadastrar um novo activo com província, categoria, fotografias, preço inicial e valor de reserva confidencial."),
        
        ("Passo 9: Administração Central e Auditoria Notarial",
         "Mostre o painel do administrador com monitorização de utilizadores, moderação de leilões activos e visualização de logs de auditoria imutáveis com carimbo de data e hora.")
    ]

    for title, desc in steps:
        story.append(Paragraph(f"<b>{title}</b>", h2_style))
        story.append(Paragraph(desc, body_style))
        story.append(Spacer(1, 4))

    story.append(PageBreak())

    # ==================== SECTION 4: CREDENCIAIS DE TESTE ====================
    story.append(Paragraph("4. Credenciais Oficiais dos Utilizadores para Testes", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=gold, spaceBefore=4, spaceAfter=12))

    story.append(Paragraph(
        "Todas as contas abaixo foram previamente semeadas na base de dados com perfis configurados, saldos de custódia e histórico para permitir testes completos imediatos.",
        body_style
    ))

    # Master Password Callout
    pw_box = [
        [Paragraph("<b>PALAVRA-PASSE MESTRA (Para todas as contas de teste):</b>", h2_style),
         Paragraph("<font size='12' color='#171717'><b>MozBid@2025!</b></font>", body_style)]
    ]
    pw_table = Table(pw_box, colWidths=[310, 205])
    pw_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FFF8E7")),
        ('BOX', (0,0), (-1,-1), 1.5, gold),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(pw_table)
    story.append(Spacer(1, 14))

    user_data = [
        [
            Paragraph("<b>Perfil (Role)</b>", h2_style),
            Paragraph("<b>Nome do Titular</b>", h2_style),
            Paragraph("<b>Email de Acesso</b>", h2_style),
            Paragraph("<b>Painel Exclusivo</b>", h2_style)
        ],
        [
            Paragraph("<font color='#991B1B'><b>ADMIN</b></font>", badge_style),
            Paragraph("Mesa de Administração MozBid", body_style),
            Paragraph("<code>administracao@mozbid.co.mz</code>", body_style),
            Paragraph("Administração Central", body_style)
        ],
        [
            Paragraph("<font color='#B45309'><b>VENDEDOR</b></font>", badge_style),
            Paragraph("Autolux Moçambique, Lda.", body_style),
            Paragraph("<code>comercial@autolux.co.mz</code>", body_style),
            Paragraph("Painel do Vendedor", body_style)
        ],
        [
            Paragraph("<font color='#B45309'><b>VENDEDOR</b></font>", badge_style),
            Paragraph("Consórcio Mineiro Cossa", body_style),
            Paragraph("<code>consorcio@cossa.co.mz</code>", body_style),
            Paragraph("Painel do Vendedor", body_style)
        ],
        [
            Paragraph("<font color='#166534'><b>COMPRADOR</b></font>", badge_style),
            Paragraph("Dra. Mariamo Nhantumbo", body_style),
            Paragraph("<code>mariamo.nhantumbo@advocacia.co.mz</code>", body_style),
            Paragraph("Painel do Comprador", body_style)
        ],
        [
            Paragraph("<font color='#166534'><b>COMPRADOR</b></font>", badge_style),
            Paragraph("Eng. Carlos Tembe", body_style),
            Paragraph("<code>carlos.tembe@engenharia.co.mz</code>", body_style),
            Paragraph("Painel do Comprador", body_style)
        ],
        [
            Paragraph("<font color='#166534'><b>COMPRADOR</b></font>", badge_style),
            Paragraph("Dr. Rui Carvalho", body_style),
            Paragraph("<code>rui.carvalho@investimentos.co.mz</code>", body_style),
            Paragraph("Painel do Comprador", body_style)
        ]
    ]

    user_table = Table(user_data, colWidths=[80, 150, 185, 100])
    user_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), gold_light),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(user_table)

    story.append(Spacer(1, 25))
    story.append(Paragraph("5. Recomendações Importantes para Testes e Demonstrações", h2_style))
    story.append(Paragraph("• <b>Persistência de Sessão no PWA:</b> Após fazer login uma vez, feche a aplicação e abra novamente pelo ícone da PWA no computador ou telemóvel para comprovar que a sessão é reconhecida automaticamente sem solicitar credenciais repetidas.", bullet_style))
    story.append(Paragraph("• <b>Testes em Duplo Ecrã:</b> Para demonstrar o tempo real, abra dois navegadores (ou um PC e um telemóvel), faça login com a Dra. Mariamo num e com o Eng. Carlos noutro, e submeta lances alternados no mesmo leilão para assistir à subida de ofertas instantânea.", bullet_style))
    story.append(Paragraph("• <b>Conformidade em MZN:</b> Todos os cálculos, taxas de incremento e montantes monetários estão formatados estritamente no padrão oficial de Moçambique com o identificador de Meticais (MZN).", bullet_style))

    story.append(Spacer(1, 30))
    story.append(HRFlowable(width="100%", thickness=0.5, color=border_color, spaceBefore=10, spaceAfter=10))
    story.append(Paragraph(
        "<font color='#888888'>MozBid Moçambique © 2026. Todos os direitos reservados. "
        "Plataforma certificada para pregões fiduciários e liquidação em Meticais (MZN). "
        "Documento gerado automaticamente pelo núcleo de engenharia da plataforma.</font>",
        ParagraphStyle('FooterText', fontName='Helvetica', fontSize=7.5, leading=11, alignment=1)
    ))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated at: {filename}")

if __name__ == '__main__':
    output_path = os.path.abspath(r"c:\Users\Tino Eduardo\Desktop\Projecto_Cossa\MOZBID_MANUAL_E_APRESENTACAO.pdf")
    build_pdf(output_path)
