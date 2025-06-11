import React from "react";
import { useTranslation } from "react-i18next";

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="about-page container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4 text-center">{t("aboutPage.title")}</h1>
      <p className="mb-4 text-lg leading-relaxed text-gray-700">{t("aboutPage.paragraph1")}</p>
      <p className="mb-4 text-lg leading-relaxed text-gray-700">{t("aboutPage.paragraph2")}</p>
      <p className="mb-4 text-lg leading-relaxed text-gray-700">{t("aboutPage.paragraph3")}</p>
      <p className="mb-4 text-lg leading-relaxed text-gray-700">{t("aboutPage.paragraph4")}</p>
    </div>
  );
};

export default AboutPage;
