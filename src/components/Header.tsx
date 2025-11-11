import Container from "./Container";
import Logo from "./Logo";
import LogoutButton from "./LogoutButton";
import ToggleThemeButton from "./ToggleThemeButton";

interface HeaderProps {
  userEmail: string;
}

export default function Header({ userEmail }: HeaderProps) {
  return (
    <header className="w-screen py-2 hidden xl:block bg-secondaryLightBG text-lightTxt shadow-sm dark:bg-secondaryDarkBG dark:shadow-none">
      <Container>
        <div className="flex justify-between items-center">
          <Logo size="sm" removeName />

          <div className="flex justify-center items-center gap-x-5">
            <ToggleThemeButton />

            <LogoutButton userEmail={userEmail} />
          </div>
        </div>
      </Container>
    </header>
  );
}
