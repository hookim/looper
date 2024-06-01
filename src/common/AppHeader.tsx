
import { Link } from "react-router-dom";

const AppHeader = () => {

    return (
        <div className="relative">
            <Link key={1} to="/" className="block absolute top-2 left-4">목록으로</Link>
            <div className="font-serif text-center p-2">Looper</div>
        </div>
    )

}

export default AppHeader;