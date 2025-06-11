import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="about-page container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4 text-center">О нас</h1>
      <p className="mb-4 text-lg leading-relaxed text-gray-700">
        Добро пожаловать в Chekpoint.kg — ваш надежный помощник в поиске комфортного жилья!
      </p>
      <p className="mb-4 text-lg leading-relaxed text-gray-700">
        Цель проекта — поддержать развитие малого бизнеса в стране, а также сделать процесс аренды жилья в Кыргызстане быстрым, удобным и безопасным. Мы стремимся создать прозрачную и доступную платформу, которая объединяет арендаторов и арендодателей, открывая новые возможности для частных лиц и предпринимателей.
      </p>
      <p className="mb-4 text-lg leading-relaxed text-gray-700">
        Chekpoint.kg стремится обеспечить высокий уровень сервиса, прозрачность сделок и поддержку пользователей на каждом этапе.
      </p>
      <p className="mb-4 text-lg leading-relaxed text-gray-700">
        Спасибо, что выбираете нас!
      </p>
    </div>
  );
};

export default AboutPage;
