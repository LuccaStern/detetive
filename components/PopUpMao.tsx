"use client"

import { CardType } from "@/types/types"
import React from "react"

export default function PopUpMao(props: {
    baralhoPessoal: CardType[], setBaralhoPessoal: React.Dispatch<React.SetStateAction<CardType[]>>,
    montes: {name: string, colapsed: boolean}[], setMontes: React.Dispatch<React.SetStateAction<{name: string, colapsed: boolean}[]>>
    add: boolean, monteAtual: string,
    setPopUpMao: React.Dispatch<React.SetStateAction<{show: boolean, add: boolean, monteAtual: string}>>
}) {

    function createMonte(name: string) {
        props.setMontes(prev  => [...prev, {name: name, colapsed: false}])
    }

    function renameMonte(name: string) {
        const newBaralhoPessoal = [...props.baralhoPessoal]
        newBaralhoPessoal.map((carta) => {
            if (carta.place === props.monteAtual) {
                carta.place = name
            }
        })
        props.setBaralhoPessoal(newBaralhoPessoal)

        const newMontes = [...props.montes]
        newMontes.map((monte) => {
            if (monte.name === props.monteAtual) {
                monte.name = name
            }
        })
        props.setMontes(newMontes)
    }

    return (
        <div className="absolute z-50
            w-screen h-screen 
            text-white
            flex flex-col justify-center items-center">
        
            <div className="bg-[#004400] rounded-4xl w-fit h-fit p-4 flex flex-col justify-center items-center">
                <form className="flex flex-col items-center justify-center gap-5 w-full h-full border-2" onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget);
                    const nome = formData.get("nome")?.toString(); 
                    if (nome) {
                        if (props.add) {   
                            createMonte(nome)
                        } else {
                            renameMonte(nome)
                        }
                        props.setPopUpMao(prev => ({...prev, show: false}))
                    }
                }}>
                    <h3 className="font-bold text-3xl">{ props.add ? 'Criar novo monte:' : `Renomear monte "${props.monteAtual}":`}</h3>
                    <input id="nome" name="nome" defaultValue={props.monteAtual} type="text" placeholder="Nome do monte" required className="border rounded w-full pl-2 pt-1 pb-1 pr-2"/>
                    <div className="w-full flex flex-row justify-evenly items-center gap-2">
                        <button type="submit" className="w-[50%] bg-[#006600] rounded cursor-pointer text-2xl p-1">{ props.add ? 'Criar' : 'Renomear'}</button>
                        <button className="w-[50%] bg-[#cc2222] rounded cursor-pointer text-2xl p-1" onClick={() => props.setPopUpMao(prev => ({...prev, show: false}))}>Cancelar</button>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}