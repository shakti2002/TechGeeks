import Sidebar from "./Sidebar";
import MentalHealthChatbot from "./message";

const SideNav = () => {
    return (
        <div className="flex h-[100%] w-[100%]">
            <div className="w-[25%] bg-[#7676ad] h-[100%]">
               <Sidebar />

            </div>
            <div className="w-[75%]">
                <MentalHealthChatbot />

            </div>
        </div>
    )
}

export default SideNav;