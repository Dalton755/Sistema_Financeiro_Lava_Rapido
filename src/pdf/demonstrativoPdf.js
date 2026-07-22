import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import logoGlowFleet from "../assets/logo.png";

pdfMake.vfs = pdfFonts.vfs;

function imagemParaBase64(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            resolve(canvas.toDataURL("image/png"));
        };

        img.onerror = reject;

        img.src = url;
    });
}

function formatarCompetencia(data) {
    const meses = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];

    const competencia = new Date(data);

    return `${meses[competencia.getMonth()]}/${competencia.getFullYear()}`;
}

function formatarData(data) {

    const d = new Date(data);

    return d.toLocaleDateString("pt-BR");

}

function formatarMoeda(valor) {

    return Number(valor || 0)
        .toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

}

export async function gerarPdfDemonstrativo(dados) {

    console.log(dados);



    const logo = await imagemParaBase64(logoGlowFleet);

    const demonstrativo = dados.demonstrativo;
    const resumo = dados.resumo;
    const itens = dados.itens || [];


    console.log(demonstrativo);

    const documento = {

        pageSize: "A4",

        pageMargins: [40, 40, 40, 40],

        content: [

            // ===========================
            // CABEÇALHO
            // ===========================

            {
                columns: [

                    {
                        width: 170,

                        image: logo,

                        fit: [140, 55],

                        alignment: "left"
                    },

                    {
                        width: "*",

                        stack: [

                            {
                                text: "DEMONSTRATIVO DE PAGAMENTO",

                                alignment: "center",

                                bold: true,

                                fontSize: 18,

                                color: "#0F172A",

                                margin: [0, 8, 0, 4]
                            }

                        ]
                    },

                    {
                        width: 140,

                        alignment: "right",

                        stack: [

                            {
                                text: "Competência",

                                fontSize: 9,

                                color: "#64748B"
                            },

                            {
                                text: formatarCompetencia(
                                    demonstrativo.fechamento.competencia
                                ),

                                bold: true,

                                fontSize: 13,

                                margin: [0, 2, 0, 0]
                            },

                            {
                                text: demonstrativo.fechamento.quinzena + "ª Quinzena",

                                fontSize: 11,

                                color: "#2563EB"
                            }

                        ]
                    }

                ]
            },



            {

                canvas: [

                    {

                        type: "line",

                        x1: 0,

                        y1: 0,

                        x2: 515,

                        y2: 0,

                        lineWidth: 1,

                        lineColor: "#CBD5E1"

                    }

                ],

                margin: [0, 12, 0, 18]

            },

            // ===========================
            // DADOS DO FUNCIONÁRIO
            // ===========================

            {
                margin: [0, 0, 0, 24],

                stack: [

                    {
                        text: demonstrativo.funcionario_nome,

                        fontSize: 15,

                        bold: true,

                        color: "#0F172A"
                    },

                    {
                        margin: [0, 6, 0, 0],

                        columns: [

                            {
                                width: "*",

                                text: [
                                    {
                                        text: "CPF: ",
                                        bold: true
                                    },
                                    demonstrativo.cpf
                                ]
                            },

                            {
                                width: "*",

                                text: [
                                    {
                                        text: "Cargo: ",
                                        bold: true
                                    },
                                    demonstrativo.cargo
                                ]
                            },

                            {
                                width: "*",

                                text: [
                                    {
                                        text: "Loja: ",
                                        bold: true
                                    },
                                    demonstrativo.loja
                                ]
                            }

                        ]
                    }

                ]
            },



            // ===========================
            // RESUMO
            // ===========================

            {
                margin: [0, 20, 0, 25],

                columns: [

                    {
                        width: "*",

                        alignment: "center",

                        stack: [

                            {
                                text: "HORAS",

                                fontSize: 11,

                                color: "#64748B",

                                bold: true
                            },

                            {
                                text: String(resumo.totalHoras),

                                fontSize: 28,

                                bold: true,

                                color: "#2563EB",

                                margin: [0, 8, 0, 0]
                            }

                        ]
                    },

                    {
                        width: "*",

                        alignment: "center",

                        stack: [

                            {
                                text: "HORAS EXTRAS",

                                fontSize: 11,

                                color: "#64748B",

                                bold: true
                            },

                            {
                                text: String(resumo.totalHorasExtras),

                                fontSize: 28,

                                bold: true,

                                color: "#F59E0B",

                                margin: [0, 8, 0, 0]
                            }

                        ]
                    },

                    {
                        width: "*",

                        alignment: "center",

                        stack: [

                            {
                                text: "VALOR BRUTO",

                                fontSize: 11,

                                color: "#64748B",

                                bold: true
                            },

                            {
                                text: formatarMoeda(resumo.valorBruto),

                                fontSize: 24,

                                bold: true,

                                color: "#16A34A",

                                margin: [0, 8, 0, 0]
                            }

                        ]
                    }

                ]
            },

            // ===========================
            // TABELA DAS DIÁRIAS
            // ===========================

            {

                text: "REGISTROS DE PONTO",

                bold: true,

                fontSize: 15,

                color: "#0F172A",

                margin: [0, 10, 0, 10]

            },

            {

                table: {

                    headerRows: 1,

                    widths: [

                        65,
                        60,
                        60,
                        45,
                        40,
                        70,
                        "*"

                    ],

                    body: [

                        [

                            {

                                text: "Data",

                                style: "cabecalhoTabela"

                            },

                            {

                                text: "Entrada",

                                style: "cabecalhoTabela"

                            },

                            {

                                text: "Saída",

                                style: "cabecalhoTabela"

                            },

                            {

                                text: "Horas",

                                style: "cabecalhoTabela"

                            },

                            {

                                text: "HE",

                                style: "cabecalhoTabela"

                            },

                            {

                                text: "Vlr Hora",

                                style: "cabecalhoTabela"

                            },

                            {

                                text: "Valor Dia",

                                style: "cabecalhoTabela"

                            }

                        ],

                        ...itens.map(item => [

                            {
                                text: formatarData(item.data),
                                alignment: "center"
                            },

                            {
                                text: item.entrada,
                                alignment: "center"
                            },

                            {
                                text: item.saida,
                                alignment: "center"
                            },

                            {
                                text: item.horas,
                                alignment: "center"
                            },

                            {
                                text: item.horas_extras,
                                alignment: "center"
                            },

                            {
                                text: formatarMoeda(item.valor_hora),
                                alignment: "right"
                            },

                            {
                                text: formatarMoeda(item.valor_dia),
                                alignment: "right",
                                bold: true
                            }

                        ])

                    ]

                },

                layout: {

                    fillColor: (rowIndex) =>

                        rowIndex === 0

                            ? "#2563EB"

                            : rowIndex % 2 === 0

                                ? "#F8FAFC"

                                : null

                }

            },

            {
                margin: [0, 12, 0, 0],

                table: {

                    widths: ["*", 120],

                    body: [

                        [
                            {
                                text: "RESUMO FINANCEIRO",
                                bold: true,
                                fontSize: 14,
                                color: "#0F172A",
                                colSpan: 2,
                                margin: [0, 0, 0, 10]
                            },
                            {}
                        ],

                        [
                            "Valor Bruto",
                            {
                                text: formatarMoeda(resumo.valorBruto),
                                alignment: "right",
                                bold: true
                            }
                        ],

                        [
                            "Adiantamentos",
                            {
                                text: formatarMoeda(resumo.adiantamentos || 0),
                                alignment: "right"
                            }
                        ],

                        [
                            "Descontos",
                            {
                                text: formatarMoeda(resumo.descontos || 0),
                                alignment: "right"
                            }
                        ],

                        [
                            
                                {
                                text: "VALOR LÍQUIDO A RECEBER",
                                bold: true,
                                fontSize: 12,
                                margin: [0, 6, 0, 0]
                            },
                            {
                                text: formatarMoeda(
                                    resumo.valorLiquido ??
                                    (
                                        (resumo.valorBruto || 0)
                                        - (resumo.adiantamentos || 0)
                                        - (resumo.descontos || 0)
                                    )
                                ),
                                alignment: "right",
                                bold: true,
                                fontSize: 13,
                                color: "#16A34A",
                                margin: [0, 6, 0, 0]
                            }
                        ]

                    ]

                },

                layout: {

                    hLineWidth: function (i) {

                        return i === 1 || i === 4 ? 1 : 0;

                    },

                    vLineWidth: function () {

                        return 0;

                    },

                    hLineColor: function () {

                        return "#CBD5E1";

                    }

                }

            },



        ],

        styles: {

            labelCabecalho: {

                alignment: "right",
                fontSize: 10,
                color: "#64748B"

            },

            valorCabecalho: {

                alignment: "right",
                bold: true,
                fontSize: 13,
                margin: [0, 2, 0, 8]

            },

            campoTitulo: {

                bold: true,
                fillColor: "#F1F5F9",
                color: "#0F172A"

            },

            cardTitulo: {

                alignment: "center",
                bold: true,
                color: "#64748B",
                margin: [0, 6, 0, 6]

            },

            cardValor: {

                alignment: "center",
                bold: true,
                fontSize: 18,
                color: "#2563EB",
                margin: [0, 10, 0, 10]

            },

            cabecalhoTabela: {

                bold: true,
                color: "white",
                alignment: "center",
                margin: [0, 4, 0, 4]

            }

        },

        cabecalhoTabela: {

            bold: true,

            color: "white",

            alignment: "center",

            margin: [0, 4, 0, 4]

        },



    };

    documento.footer = function (currentPage, pageCount) {

        return {

            margin: [40, 5, 40, 10],

            columns: [

                {

                    text:
                        "Glow Fleet • Demonstrativo gerado em " +
                        new Date().toLocaleDateString("pt-BR") +
                        " às " +
                        new Date().toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit"
                        }),

                    fontSize: 8,

                    color: "#64748B"

                },

                {

                    text: currentPage + " / " + pageCount,

                    alignment: "right",

                    fontSize: 8,

                    color: "#64748B"

                }

            ]

        };

    };

    pdfMake.createPdf(documento).open();

}