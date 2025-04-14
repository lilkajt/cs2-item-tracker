import Button from "./Button"

function CenterSquare() {
  return (
    <div className="main bg-green-300 w-full h-block text-beige-100 flex flex-col justify-center items-center text-center">
        <div className="w-full my-5">
            <span className="font-display2 font-bold text-4xl">Smart Solutions and Simple Interface</span>
        </div>
        <div className="leading-2 px-10 mb-7">
            <span className="font-medium text-lg">Get real-time insights, effortless budgeting, and expert investment guidance.</span>
        </div>
        <Button color="orange">Sign Up</Button>
    </div>
  )
}

export default CenterSquare