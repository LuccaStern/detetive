
'use client'

import Card from '@/components/Card'
import { CardType } from '@/types/types'
import CardsJSON from '@/data/cards.json'
import React from 'react'

export default function Home() {

    const [baralhoPessoal, setBaralhoPessoal] = React.useState<CardType[]>(CardsJSON.cards)

    // Dados temporários para testar o multiplayer
    const roomId = 'sala123'
    const playerId = 'jogador1'

    const playerIds = [
        'jogador1',
        'jogador2',
        'jogador3',
        'jogador4'
    ]

    const [cartas, setCartas] = React.useState<CardType[]>([])
    const [excedentes, setExcedentes] = React.useState<CardType[]>([])

    const [iniciada, setIniciada] = React.useState(false)
    const [carregando, setCarregando] = React.useState(false)
    const [erro, setErro] = React.useState<string | null>(null)

    const [montes, setMontes] = React.useState([{name: "Mão", colapsed: false}, {name: "Inocentes", colapsed: false}] as {name: string, colapsed: boolean}[])

    async function iniciarPartida() {
        if (carregando || iniciada) return

        setCarregando(true)
        setErro(null)

        try {
            const response = await fetch('/api/partida', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    roomId,
                    playerId,
                    playerIds
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao iniciar partida.')
            }

            setCartas(data.cartas)
            setExcedentes(data.excedentes)
            setIniciada(true)

        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : 'Erro inesperado.'
            )
        } finally {
            setCarregando(false)
        }
    }

    function moverCarta(nomeCarta: string, destino: string) {
        setBaralhoPessoal(prev =>
            prev.map(carta =>
                carta.name === nomeCarta
                    ? { ...carta, place: destino }
                    : carta
            )
        )
    }

    return (
        <div className="flex flex-col w-screen h-screen">

            {/* TABLE */}
            <div className="flex flex-col items-center justify-center w-full h-full gap-4">

                {!iniciada ? (
                    <button
                        onClick={iniciarPartida}
                        disabled={carregando}
                        className="bg-green-700 hover:bg-green-800 disabled:bg-gray-500 text-white font-bold px-8 py-4 rounded-xl cursor-pointer disabled:cursor-wait"
                    >
                        {carregando ? 'Iniciando partida...' : 'Iniciar Partida'}
                    </button>
                ) : (
                    <div className="flex flex-col items-center gap-4">

                        <h2 className="text-2xl font-bold">
                            Partida iniciada!
                        </h2>

                        <div className="flex flex-col items-center gap-2">
                            <h3 className="font-bold">
                                Cartas excedentes
                            </h3>

                            <div className="flex flex-row gap-2">
                                {excedentes.map((carta, index) => (
                                    <div
                                        key={index}
                                        className="bg-white text-black p-4 rounded-lg shadow"
                                    >
                                        <p>{carta.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {carta.type}
                                        </p>
                                    </div>
                                ))}

                                {excedentes.length === 0 && (
                                    <p>Nenhuma carta excedente.</p>
                                )}
                            </div>
                        </div>

                    </div>
                )}

                {erro && (
                    <p className="text-red-500">
                        {erro}
                    </p>
                )}

            </div>

            
        {/* HAND */}
        <div className="flex flex-row items-start justify-start gap-2 w-full h-65 bg-[#005500] p-1 overflow-y-hidden">

            {montes.map(({name, colapsed}, index) => {

                const cartasDoMonte = baralhoPessoal.filter(
                    c => c.place === name
                )

                return (
                    <div
                        key={name}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault()

                            const nomeCarta = e.dataTransfer.getData('text/plain')

                            if (nomeCarta) {
                                moverCarta(nomeCarta, name)
                            }
                        }}
                        className="flex flex-col border-2 border-white rounded overflow-x-hidden w-full max-w-fit"
                    >
                        <div className='flex flex-row w-full justify-between gap-2'>
                            <p className="w-fit pl-1 text-white">
                                {name} - {cartasDoMonte.length}
                            </p>
                            <div className='text-white pr-1 w-fit pb-0 -mb-10'> 
                                <span className="material-symbols-outlined cursor-pointer hover:text-[#00ff00]">
                                    edit
                                </span>
                                <span className="material-symbols-outlined cursor-pointer hover:text-[#ffff00]" onClick={() => {
                                    const newMontes = [...montes]
                                    newMontes[index].colapsed = !colapsed
                                    setMontes(newMontes)
                                }}>
                                    { colapsed ? "add" : "remove"}
                                </span> 
                                { index > 0 && (
                                    <span className="material-symbols-outlined cursor-pointer hover:text-[#ff0000]" onClick={() => {
                                        const newBaralhoPessoal = [...baralhoPessoal]
                                        newBaralhoPessoal.map((c) => {
                                            if (c.place === name) {
                                                c.place = montes[0].name
                                            }
                                        })
                                        setBaralhoPessoal(newBaralhoPessoal)
                                        setMontes(prev => prev.filter(m => m.name != name))
                                    }}>
                                        close
                                    </span>
                                )}
                            </div>
                        </div>
                        

                        <div className={`flex flex-row items-center justify-${(cartasDoMonte.length > 1 && !colapsed) ? 'start' : 'center'} overflow-x-auto gap-2 w-full`}>

                            {(cartasDoMonte.length > 0 && !colapsed) ? (

                                cartasDoMonte.map((carta) => (
                                    // <div
                                    //     key={carta.name}
                                    //     draggable
                                    //     onDragStart={(e) => {
                                    //         e.dataTransfer.setData(
                                    //             'text/plain',
                                    //             carta.name
                                    //         )

                                    //         e.dataTransfer.effectAllowed = 'move'
                                    //     }}
                                    //     className="flex flex-col justify-center items-center
                                    //         bg-white text-black rounded-lg shadow border
                                    //         h-32 aspect-3/4"
                                    // >
                                    //     <p className="font-bold text-center">
                                    //         {carta.name}
                                    //     </p>

                                    //     <p className="text-sm text-gray-500">
                                    //         {carta.type}
                                    //     </p>
                                    // </div>
                                    <Card key={carta.name} carta={carta}/>
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


        </div>
    )
}
