export function formatarCompetencia(data, quinzena) {

    if (!data) return "";

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

    const d = new Date(data);

    return `${meses[d.getMonth()]}/${d.getFullYear()} • ${quinzena}ª Quinzena`;

}