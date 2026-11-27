
import React from "react"
import { CardType } from "@/types/types"
import Card from "./Card"

type MonteType = {
    name: string
    colapsed: boolean
}

type DragData =
    | { type: "card"; name: string }
    | { type: "monte"; name: string }

export default function Hand(props: {
    montes: MonteType[]
    setMontes: React.Dispatch<React.SetStateAction<MonteType[]>>
    setPopUpMao: React.Dispatch<React.SetStateAction<{
        show: boolean
        add: boolean
        monteAtual: string
    }>>
    baralhoPessoal: CardType[]
    setBaralhoPessoal: React.Dispatch<React.SetStateAction<CardType[]>>
    montePrincipal: string
}) {

    // Recupera os dados do elemento arrastado
    function obterDragData(e: React.DragEvent): DragData | null {
        try {
            return JSON.parse(
                e.dataTransfer.getData("application/json")
            ) as DragData
        } catch {
            return null
        }
    }

    // Move ou reordena uma carta
    function moverCarta(
        nomeCarta: string,
        destino: string,
        cartaAlvo?: string
    ) {
        props.setBaralhoPessoal(prev => {

            const origemIndex = prev.findIndex(
                c => c.name === nomeCarta
            )

            if (origemIndex === -1 || nomeCarta === cartaAlvo) {
                return prev
            }

            const novoBaralho = [...prev]

            // Remove a carta da posição original
            const [cartaMovida] = novoBaralho.splice(origemIndex, 1)

            // Atualiza o monte da carta
            const cartaAtualizada = {
                ...cartaMovida,
                place: destino
            }

            // Se foi solta sobre outra carta, insere antes dela
            if (cartaAlvo) {

                const destinoIndex = novoBaralho.findIndex(
                    c => c.name === cartaAlvo
                )

                if (destinoIndex !== -1) {
                    novoBaralho.splice(
                        destinoIndex,
                        0,
                        cartaAtualizada
                    )

                    return novoBaralho
                }
            }

            // Se foi solta no espaço vazio, adiciona ao final
            novoBaralho.push(cartaAtualizada)

            return novoBaralho
        })
    }

    // Reordena os montes, inclusive a Mão
    function moverMonte(nomeMonte: string, nomeDestino: string) {

        if (nomeMonte === nomeDestino) return

        props.setMontes(prev => {

            const origemIndex = prev.findIndex(
                m => m.name === nomeMonte
            )

            if (origemIndex === -1) return prev

            const novosMontes = [...prev]

            // Retira o monte da posição original
            const [monteMovido] = novosMontes.splice(origemIndex, 1)

            // Encontra a posição atualizada do destino
            const destinoIndex = novosMontes.findIndex(
                m => m.name === nomeDestino
            )

            if (destinoIndex === -1) return prev

            // Insere antes do monte de destino
            novosMontes.splice(destinoIndex, 0, monteMovido)

            return novosMontes
        })
    }

    return (
        <div className="flex flex-row items-start justify-start gap-2 w-full h-70 bg-[#005500] p-1 overflow-x-auto overflow-y-hidden">

            <div className='fixed w-full flex flex-row justify-end items-end -m-1 -mt-11 h-10'>

                <div className='flex flex-row justify-center items-center pl-4 pt-4 pb-1 pr-1 bg-[#004400] h-fit aspect-square text-white rounded-tl-full'>
                    <button className="material-symbols-outlined cursor-pointer scale-[1.7] hover:text-[#00ff00]" onClick={() => {
                        props.setPopUpMao({show: true, add: true, monteAtual: ''})
                    }}>
                        add
                    </button>
                </div>
            </div>

            {props.montes.map(({name, colapsed}, index) => {

                const cartasDoMonte = props.baralhoPessoal.filter(
                    c => c.place === name
                )

                const doubleDigits = props.baralhoPessoal.filter(c => c.place === name).length >= 10 ? 1 : 0
                const minWidth = ((name.length + 4 + doubleDigits) * 10) + 84

                return (
                    <div
                        key={index}

                        onDragOver={(e) => e.preventDefault()}

                        onDrop={(e) => {
                            e.preventDefault()

                            const data = obterDragData(e)

                            if (!data) return

                            if (data.type === "card") {
                                moverCarta(data.name, name)
                            }

                            if (data.type === "monte") {
                                moverMonte(data.name, name)
                            }
                        }}

                        className={`flex flex-col flex-wrap border-2 border-white rounded overflow-x-hidden w-full max-w-fit`}
                        style={{ minWidth: `${minWidth}px` }}
                    >

                        <div className='flex flex-row flex-nowrap w-full min-w-fit justify-between gap-2' onContextMenu={() => {
                            console.log("TESTE")
                            const cartasDoMonte = props.baralhoPessoal.filter(c => c.place === name)
                            const locais = cartasDoMonte.filter(c => c.type === 'local').sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
                            const armas = cartasDoMonte.filter(c => c.type === 'arma').sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
                            const pessoas = cartasDoMonte.filter(c => c.type === 'pessoa').sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
                            props.setBaralhoPessoal(prev => [...prev.filter(c => c.place != name).concat(locais).concat(armas).concat(pessoas)])
                        }}>

                            <p
                                draggable
                                onDragStart={(e) => {
                                    e.dataTransfer.setData(
                                        "application/json",
                                        JSON.stringify({
                                            type: "monte",
                                            name
                                        } satisfies DragData)
                                    )

                                    e.dataTransfer.effectAllowed = "move"
                                }}
                                className="w-fit pl-1 text-white text-nowrap font-mono cursor-grab active:cursor-grabbing"
                                title="Arraste para reordenar o monte"
                            >
                                {name} - {cartasDoMonte.length}
                            </p>

                            <div className='flex flex-nowrap text-white pr-1 w-fit pb-0 -mb-10'>

                                <span className="material-symbols-outlined cursor-pointer hover:text-[#00ff00]" onClick={() => {
                                    props.setPopUpMao({show: true, add: false, monteAtual: name})
                                }}>
                                    edit
                                </span>

                                <span className="material-symbols-outlined cursor-pointer hover:text-[#ffff00]" onClick={() => {
                                    props.setMontes(prev =>
                                        prev.map(m =>
                                            m.name === name
                                                ? {...m, colapsed: !m.colapsed}
                                                : m
                                        )
                                    )
                                }}>
                                    { colapsed ? "add" : "remove"}
                                </span>

                                { name != props.montePrincipal && (
                                    <span className="material-symbols-outlined cursor-pointer hover:text-[#ff0000]" onClick={() => {

                                        // A Mão pode não ser mais o primeiro monte
                                        const nomeMao = props.montes.find(
                                            m => m.name === props.montePrincipal
                                        )?.name

                                        if (!nomeMao) return

                                        props.setBaralhoPessoal(prev =>
                                            prev.map(c =>
                                                c.place === name
                                                    ? {...c, place: nomeMao}
                                                    : c
                                            )
                                        )

                                        props.setMontes(prev =>
                                            prev.filter(m => m.name !== name)
                                        )
                                    }}>
                                        close
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className={`flex flex-row items-center justify-${(cartasDoMonte.length > 1 && !colapsed) ? 'start' : 'center'} overflow-x-auto gap-2 w-full`}>

                            {(cartasDoMonte.length > 0 && !colapsed) ? (

                                cartasDoMonte.map((carta) => (
                                    <div
                                        key={carta.name}

                                        onDragOver={(e) => e.preventDefault()}

                                        onDrop={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()

                                            const data = obterDragData(e)

                                            if (!data || data.type !== "card") {
                                                return
                                            }

                                            moverCarta(
                                                data.name,
                                                name,
                                                carta.name
                                            )
                                        }}
                                    >
                                        <Card carta={carta}/>
                                    </div>
                                ))

                            ) : (

                                <div className="flex flex-col justify-center items-center
                                    bg-white/20 text-white rounded-lg border-2 border-dashed
                                    border-white/50 h-32 aspect-3/4 shrink-0"
                                >
                                    <p className="text-center text-sm">
                                        Arraste uma carta para cá
                                    </p>
                                </div>

                            )}

                        </div>
                    </div>
                )
            })}

        </div>
    )
}
