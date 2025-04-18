import CenterSquare from "@/components/CenterSquare"
import Title from "@/components/Title"

function Home() {
  return (
    <div className="flex flex-col gap-17">
        <CenterSquare/>
        <Title color="beige">Our Features</Title>
    </div>
  )
}

export default Home