import { CardType } from "@/types/types"

export default function ordernarCartas(cartas: CardType[]) {
    const locais = cartas.filter(c => c.type === 'local').sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
    const armas = cartas.filter(c => c.type === 'arma').sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
    const pessoas = cartas.filter(c => c.type === 'pessoa').sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
    return locais.concat(armas).concat(pessoas)
}