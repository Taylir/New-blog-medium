import Image from "next/image";
import Link from "next/link";
import styleUtils from "../src/styles/utils.module.css";

export default function Header() {
  return (
    <>
      <header className={styleUtils.nav}>
        <div className={styleUtils.nav__left}>
          <Link href={"/"}>
            <Image
              height={80}
              width={80}
              src={"/images/No background.png"}
              alt="The logo for Mediums website"
            />
          </Link>
          <div className={styleUtils.nav__menu}>
            <h3
              onClick={() =>
                alert(
                  "This is currently just a personal blog show casing the blog aspect. In the future I will make something like that though!"
                )
              }
            >
              About
            </h3>
            <h3
              onClick={() =>
                alert(
                  "This is currently just a personal blog show casing the blog aspect. In the future I will make something like that though!"
                )
              }
            >
              Contact
            </h3>
            <h3
              onClick={() =>
                alert(
                  "This is currently just a personal blog show casing the blog aspect. In the future I will make something like that though!"
                )
              }
            >
              Follow
            </h3>
          </div>
        </div>
        <div className={styleUtils.lines__wrapper}>
          <div className={styleUtils.line}></div>
          <div className={styleUtils.line}></div>
          <div className={styleUtils.line}></div>
        </div>
        <div className={styleUtils.nav__right}>
          <h3
            onClick={() =>
              alert(
                "This is currently just a personal blog show casing the blog aspect. In the future I will make something like that though!"
              )
            }
          >
            Log in
          </h3>
          <h3
            onClick={() =>
              alert(
                "This is currently just a personal blog show casing the blog aspect. In the future I will make something like that though!"
              )
            }
          >
            Get Started
          </h3>
        </div>
      </header>
    </>
  );
}
