export default function RoomSizeSelector({
  roomSize,
  setRoomSize,
  disabled,
}: {
  roomSize: number
  setRoomSize: (size: number) => void
  disabled?: boolean
}) {
  return (
    <div className="text-sm text-neutral-300">
      <label className="block mb-2">Room Size</label>
      <div className="flex justify-center gap-2">
        {[2, 3, 4].map((size) => (
          <button
            key={size}
            onClick={() => setRoomSize(size)}
            className={`px-4 py-1 rounded-full border ${
              roomSize === size
                ? 'bg-green-600 border-green-400 text-white'
                : 'border-neutral-600 text-neutral-400 hover:bg-neutral-700'
            }`}
            disabled={disabled}
          >
            {size} Players
          </button>
        ))}
      </div>
    </div>
  )
}
