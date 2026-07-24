import React from "react";
import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-2">
            <h3 className="font-heading text-3xl md:text-4xl mb-4">
              Arizona Sustainability
              <br />
              Navigator
            </h3>

            <p className="text-background/60 text-sm max-w-sm leading-relaxed">
              Connecting Arizona businesses to waste management resources for
              a sustainable future.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-background/60 mb-6">
              Navigate
            </h4>

            <div className="flex flex-col gap-3">
              {[
                { label: "Home", to: "/" },
                { label: "Resources", to: "/resource" },
                { label: "Events", to: "/events" },
                { label: "Profile", to: "/profile" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-primary text-sm underline underline-offset-4 hover:no-underline transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-background/60 mb-6">
              Connect
            </h4>

            <div className="flex flex-col gap-3">
              <a
                href="tel:+16025551234"
                className="text-primary text-sm underline underline-offset-4 hover:no-underline"
              >
                (602) 555-1234
              </a>

              <a
                href="mailto:info@azsustainability.org"
                className="text-primary text-sm underline underline-offset-4 hover:no-underline"
              >
                info@azsustainability.org
              </a>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-background/60 hover:text-primary transition-colors"
              >
                <FaFacebook size={18} />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-background/60 hover:text-primary transition-colors"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-background/60 hover:text-primary transition-colors"
              >
                <FaLinkedin size={18} />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-background/60 hover:text-primary transition-colors"
              >
                <FaTwitter size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="h-[0.5px] bg-background/10 mt-16 mb-8" />

        <div className="flex items-center justify-between">
          <p className="text-background/60 text-xs">
            © {new Date().getFullYear()} Arizona Sustainability Navigator. All
            rights reserved.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="group flex flex-col items-center gap-1 text-primary hover:text-background transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp size={16} />
            <div className="w-[2px] h-8 bg-primary group-hover:bg-background transition-colors" />
          </button>
        </div>
      </div>
    </footer>
  );
}