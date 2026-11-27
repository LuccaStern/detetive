"use client"

import { CardType } from "@/types/types"
import React from "react"

export default function Card(props: {carta?: CardType, draggable: boolean, tag?: string, tags?: string[]}) {

    const [tag, setTag] = React.useState(props.tag ? props.tag : '#000')
    const [showTag, setShowTag] = React.useState(false)

    React.useEffect(() => {
        if (props.tags && props.tag) {
            if (!props.tags.includes(tag)) {
                setShowTag(false)
            }
        }
    }, [props.tags])

    return (
        <>
        { props.carta ? (
            <div draggable={props.draggable}
                onDragStart={(e) => {
                    e.dataTransfer.setData(
                        "application/json",
                        JSON.stringify({
                            type: "card",
                            name: props.carta!.name
                        })
                    )

                    e.dataTransfer.effectAllowed = "move"
                }}
                className="flex flex-col justify-center items-center
                    bg-white text-black rounded-lg shadow
                    h-32 aspect-3/4 cursor-grab active:cursor-grabbing"
                style={{ border: `solid ${showTag ? `2px ${tag}` : '1px black'}`}} 
                onContextMenu={(e) => {
                    e.preventDefault()
                    if (props.tag) {
                        if (tag != props.tag) {
                            setTag(props.tag)
                            if (!showTag) {
                                setShowTag(true)
                            }
                        } else {
                            setShowTag(prev => !prev)
                        }
                    }
                }}>
                <p className="font-bold text-center">
                    {props.carta.name}
                </p>

                <p className="text-sm text-gray-500">
                    {props.carta.type}
                </p>
            </div>
        ) : (
            <div className="flex flex-col justify-center items-center
                bg-white/20 text-white rounded-lg border-2 border-dashed
                border-white/50 h-32 aspect-3/4 shrink-0">

                <p className="text-center text-sm">
                    Arraste uma carta para cá
                </p>

            </div>
        )}
        </>
        
    )
}
/*



*/