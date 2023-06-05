import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { Tooltip } from "react-tooltip";
import { ArrowLeftOnRectangleIcon, HomeModernIcon } from "@heroicons/react/24/solid";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { usePathname } from "next/navigation";
import defaultUserLogo from './../../public/defaultUser.svg';

type Props = {}

function NavBar({}: Props) {
  const path = usePathname();
  return (
    <section className='top-0 z-40 sticky flex flex-col items-center align-middle justify-center md:mx-10 mx-1 text-center'>
      <div className="flex-row flex items-center align-middle bg-black justify-between p-1 text-white rounded-b-3xl">
        { path == '/' ? (
          <button onClick={() => signOut(auth)} data-tooltip-id="nav-tooltip" data-tooltip-content="Sign out"  className='text-white md:mr-3 mr-1 items-center'>
            <ArrowLeftOnRectangleIcon 
              className='h-10 w-10 md:h-14 md:w-14 text-white/80 hover:text-green-500/80'
            />     
          </button>
        ) : (
          <Link href="/" className="text-white md:mr-3 mr-1 ml-1 items-center" data-tooltip-id="nav-tooltip" data-tooltip-content="Home">
            <HomeModernIcon 
              className='h-10 w-10 md:h-14 md:w-14 text-white/80 hover:text-green-500/80'
            />     
          </Link>
        )}
        <SearchBar />
        <Image 
          src={auth?.currentUser?.photoURL || defaultUserLogo}
          alt="user logo"
          width="0"
          height="0"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={'/defaultVideoImg.svg'}
          className="rounded-full h-auto w-10 md:w-14 md:ml-3 hidden md:block"
        />
      </div>
      <Tooltip id="nav-tooltip" place="bottom"/>
    </section>
  )
};

export default NavBar;