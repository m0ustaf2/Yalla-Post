import { Footer, FooterCopyright } from "flowbite-react";
import { Link } from 'react-router-dom';

export default function AppFooter() {
  return (
    <Footer className="rounded-none" container>
      <div className="w-full text-center">
        <FooterCopyright 
          as={Link} 
          to="/" 
          by="!MUSTAFA_ESMAIL™" 
          year={2026} 
        />
      </div>
    </Footer>
  )
}