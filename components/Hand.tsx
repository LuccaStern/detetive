import { CardType } from "@/types/types"
import Card from "./Card"

export default function Hand(props: {
    montes: {name: string, colapsed: boolean}[], setMontes: React.Dispatch<React.SetStateAction<{name: string, colapsed: boolean}[]>>
    setPopUpMao: React.Dispatch<React.SetStateAction<{show: boolean, add: boolean, monteAtual: string}>>,
    baralhoPessoal: CardType[], setBaralhoPessoal: React.Dispatch<React.SetStateAction<CardType[]>>
}) {

    function moverCarta(nomeCarta: string, destino: string) {
        props.setBaralhoPessoal(prev =>
            prev.map(carta =>
                carta.name === nomeCarta
                    ? { ...carta, place: destino }
                    : carta
            )
        )
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

                const minWidth = ((name.length + 4) * 10) + 84

                return (
                    <div
                        key={index}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault()

                            const nomeCarta = e.dataTransfer.getData('text/plain')

                            if (nomeCarta) {
                                moverCarta(nomeCarta, name)
                            }
                        }}
                        className={`flex flex-col flex-wrap border-2 border-white rounded overflow-x-hidden w-full max-w-fit`}
                        style={{ minWidth: `${minWidth}px` }}
                    >
                        <div className='flex flex-row flex-nowrap w-full min-w-fit justify-between gap-2'>
                            <p className="w-fit pl-1 text-white text-nowrap font-mono">
                                {name} - {cartasDoMonte.length}
                            </p>
                            <div className='flex flex-nowrap text-white pr-1 w-fit pb-0 -mb-10'> 
                                <span className="material-symbols-outlined cursor-pointer hover:text-[#00ff00]" onClick={() => {
                                    props.setPopUpMao({show: true, add: false, monteAtual: name})
                                }}>
                                    edit
                                </span>
                                <span className="material-symbols-outlined cursor-pointer hover:text-[#ffff00]" onClick={() => {
                                    const newMontes = [...props.montes]
                                    newMontes[index].colapsed = !colapsed
                                    props.setMontes(newMontes)
                                }}>
                                    { colapsed ? "add" : "remove"}
                                </span> 
                                { index > 0 && (
                                    <span className="material-symbols-outlined cursor-pointer hover:text-[#ff0000]" onClick={() => {
                                        const newBaralhoPessoal = [...props.baralhoPessoal]
                                        newBaralhoPessoal.map((c) => {
                                            if (c.place === name) {
                                                c.place = props.montes[0].name
                                            }
                                        })
                                        props.setBaralhoPessoal(newBaralhoPessoal)
                                        props.setMontes(prev => prev.filter(m => m.name != name))
                                    }}>
                                        close
                                    </span>
                                )}
                            </div>
                        </div>
                        

                        <div className={`flex flex-row items-center justify-${(cartasDoMonte.length > 1 && !colapsed) ? 'start' : 'center'} overflow-x-auto gap-2 w-full`}>

                            {(cartasDoMonte.length > 0 && !colapsed) ? (

                                cartasDoMonte.map((carta) => (
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
    )
}