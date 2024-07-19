import { notFound } from 'next/navigation';

import ForDevelopers from 'components/pages/about/for-developers';
import Hero from 'components/pages/about/hero';
import Leadership from 'components/pages/about/leadership';
import OpenSource from 'components/pages/about/open-source';
import Timeline from 'components/pages/about/timeline';
import Layout from 'components/shared/layout';
import { getAboutPage } from 'utils/api-pages';
import getMetadata from 'utils/get-metadata';

const AboutUsPage = () => (
  <Layout>
    <Hero />
    <Timeline />
    <ForDevelopers />
    <OpenSource />
    <Leadership />
  </Layout>
);

export async function generateMetadata() {
  const page = await getAboutPage();

  if (!page) return notFound();

  const {
    seo: {
      title,
      metaDesc,
      metaKeywords,
      metaRobotsNoindex,
      opengraphTitle,
      opengraphDescription,
      twitterImage,
    },
  } = page;

  return getMetadata({
    title: opengraphTitle || title,
    description: opengraphDescription || metaDesc,
    keywords: metaKeywords,
    robotsNoindex: metaRobotsNoindex,
    pathname: '/about-us',
    imagePath: twitterImage?.mediaItemUrl,
  });
}

export const revalidate = 60;

export default AboutUsPage;
