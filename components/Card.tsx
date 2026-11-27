
import { CardType } from "@/types/types"

export default function Card(props: {carta: CardType}) {
    return (
        <div
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData(
                    "application/json",
                    JSON.stringify({
                        type: "card",
                        name: props.carta.name
                    })
                )

                e.dataTransfer.effectAllowed = "move"
            }}
            className="flex flex-col justify-center items-center
                bg-white text-black rounded-lg shadow border
                h-32 aspect-3/4 cursor-grab active:cursor-grabbing"
        >
            <p className="font-bold text-center">
                {props.carta.name}
            </p>

            <p className="text-sm text-gray-500">
                {props.carta.type}
            </p>
        </div>
    )
}
