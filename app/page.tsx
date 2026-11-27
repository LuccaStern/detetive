
'use client'

import PopUpMao from '@/components/PopUpMao'
import Card from '@/components/Card'
import Hand from '@/components/Hand'
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

    const [montes, setMontes] = React.useState([{name: "Mão", colapsed: false}] as {name: string, colapsed: boolean}[])  
    const [montePrincipal, setMontePrincipal] = React.useState('Mão')

    const [tags, setTags] = React.useState([] as string[])

    const [popUpMao, setPopUpMao] = React.useState({show: false, add: true, monteAtual: ''} as {show: boolean, add: boolean | null, monteAtual: string})

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

    return (
        <div className="flex flex-col w-screen h-screen">
            
            { popUpMao.show &&
                <PopUpMao montes={montes} setMontes={setMontes}
                    baralhoPessoal={baralhoPessoal} setBaralhoPessoal={setBaralhoPessoal}
                    add={popUpMao.add} monteAtual={popUpMao.monteAtual} setPopUpMao={setPopUpMao}
                    montePrincipal={montePrincipal} setMontePrincipal={setMontePrincipal} 
                    setTags={setTags} />
            }

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
            <Hand baralhoPessoal={baralhoPessoal} setBaralhoPessoal={setBaralhoPessoal}
                montes={montes} setMontes={setMontes} setPopUpMao={setPopUpMao}
                montePrincipal={montePrincipal} tags={tags} setTags={setTags}/>


        </div>
    )
}
