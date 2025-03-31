import Link from "next/link"
import { FlameIcon as Fire } from "lucide-react"

const Footer = () => {
  return (
    <footer className="w-full bg-background py-10 mt-20">
      <div className="netflix-container">
        <div className="flex items-center mb-6">
          <Fire className="h-6 w-6 text-primary mr-2" />
          <span className="text-xl font-bold">FireAnime</span>
        </div>

        <div className="netflix-footer-links mb-8">
          <Link href="/about" className="netflix-footer-link">
            About
          </Link>
          <Link href="/terms" className="netflix-footer-link">
            Terms of Service
          </Link>
          <Link href="/privacy" className="netflix-footer-link">
            Privacy
          </Link>
          {/* <Link href="/contact" className="netflix-footer-link">
            Contact Us
          </Link> */}
          {/* <Link href="/help" className="netflix-footer-link">
            Help Center
          </Link> */}
          {/* <Link href="/account" className="netflix-footer-link">
            Account
          </Link> */}
          <Link href="/genres" className="netflix-footer-link">
            Browse
          </Link>
          <Link href="/calendar" className="netflix-footer-link">
            Calendar
          </Link>
        </div>

        <div className="netflix-footer">
          <p className="mb-4">© {new Date().getFullYear()} FireAnime. All rights reserved.</p>
          <p>
            FireAnime is a community-driven anime streaming platform created by fans, for fans. We don't run ads, sell
            user data, or charge subscription fees.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

