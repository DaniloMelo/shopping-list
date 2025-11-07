import Head from "next/head";

interface PageTitleProps {
  title: string;
}

export default function PageTitle({ title }: PageTitleProps) {
  return (
    <Head>
      <title>Shopping List | {title}</title>
    </Head>
  );
}
