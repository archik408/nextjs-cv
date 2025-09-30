import type { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import ArticleTitle from '@/components/article-title';
import { SharePanel } from '@/components/share-panel';
import { StructuredData, createArticleSchema } from '@/components/structured-data';
import NavigationButtons from '@/components/navigation-buttons';

export const metadata: Metadata = generateSEOMetadata({
  title: '15 лет в коммерческой разработке: что я понял? Что ничего не понял',
  description:
    'Личные наблюдения о профессии, знаниях, титулах и продуктах после 15 лет в коммерческой разработке — без абсолютных истин, но с рабочими выводами.',
  keywords:
    'Карьерные советы разработчику, опыт разработчика, frontend карьера, тайтлы, продукт vs аутсорс, профессиональный рост',
  path: '/blog/15-years-in-dev',
  type: 'article',
  publishedTime: '2025-09-11T00:00:00.000Z',
  author: 'Artur Basak',
  locale: 'ru',
});

export default function Article15YearsInDev() {
  const articleSchema = createArticleSchema({
    title: '15 лет в коммерческой разработке: что я понял? Что ничего не понял',
    description:
      'О людях и машинах, карьере, знаниях, званиях и сути работы. Набор тезисов-наблюдений вместо «единственно правильных» ответов.',
    url: 'https://arturbasak.dev/blog/15-years-in-dev',
    publishedTime: '2025-09-11T00:00:00.000Z',
    author: 'Artur Basak',
  });

  return (
    <>
      <StructuredData data={articleSchema} />
      <article className="py-10 md:py-20 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        <div className="max-w-3xl mx-auto">
          <NavigationButtons levelUp="blog" showLanguageSwitcher={false} showThemeSwitcher />
          <ArticleTitle text="15 лет в коммерческой разработке. Что я понял? Что я ничего не понял." />

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
            <span>11 сентября 2025</span>
            <span>•</span>
            <span>Artur Basak</span>
          </div>

          <div className="mb-8">
            <SharePanel
              title="15 лет в коммерческой разработке: что я понял? Что ничего не понял"
              url="https://arturbasak.dev/blog/15-years-in-dev"
              summary="Личные наблюдения о профессии, знаниях, титулах и продуктах после 15 лет в коммерческой разработке — без абсолютных истин, но с рабочими выводами."
            />
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Ровно 15 лет назад я совершил свой первый коммит в коммерческом проекте. 🤓
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            И нет, это был не git push, а добрый старый Tortoise SVN. Юбилей, как-никак, — самое
            время подвести итоги и поделиться наблюдениями.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Главный итог звучит парадоксально: чем больше я узнаю, тем сильнее убеждаюсь, как мало
            на самом деле знаю о «правильном» программировании. Мне кажется, я не одинок в этом
            ощущении. Найти того, кто обладает исчерпывающей истиной о «правильном» коде, — задача
            со звёздочкой. Разве что в академических учебниках. А если кто-то уверенно заявляет
            обратное — есть шанс, что он обманывает и вас, и себя.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Так что вместо готовых ответов я выношу с собой во взрослую жизнь набор рабочих
            тезисов-наблюдений. Возможно, они отзовутся и в вас.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">💡 О людях и машинах</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Компьютеры все еще нравятся мне больше людей. Их логика предсказуема, и с ними проще
            договориться. 😉 Люди — самый сложный и непредсказуемый компонент в любой IT-системе.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">💡 О карьере</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Программирование и менеджмент — это две разные, почти не пересекающиеся профессии.
            Классический путь «программист -&gt; менеджер» — это часто ловушка, а не рост. Это смена
            профессии, а не повышение. Выбирайте осознанно.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">💡 О знаниях</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Технологии устаревают еще на этапе их изучения. Гнаться за всем подряд — путь в никуда.
            Гораздо важнее фундамент (алгоритмы, структуры данных, принципы ООП, паттерны) и умение
            быстро учиться. Ваш главный навык — это способность осваивать новое.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">💡 О сути работы</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Язык программирования — не важен, это всего лишь инструмент. Никто не платит деньги за
            красивый код или умный алгоритм сами по себе. Платят — за решение бизнес-проблем и за
            результат.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">💡 О личном бренде</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Программировать и говорить о программировании — два разных навыка. Умение понятно
            доносить мысли, выступать, писать статьи и «молоть языком» для карьеры иногда даже
            важнее чистого кода. Помните тот анекдот: «Давайте наймем мидла, а то предыдущий сеньор
            только на конференциях выступал, а код не писал»? В этом есть доля суровой правды.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">💡 О продуктах и аутсорсе</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Разницы для программиста почти нет. Можно в продуктовой компании годами делать никому не
            нужную фичу, а можно на аутсорсе или аутстаффе создавать проект, который меняет жизни
            миллионов. И наоборот. Всё зависит от конкретной задачи, команды и миссии, которую вы
            для себя находите.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">💡 О званиях</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            «Джун», «Миддл», «Сеньор» — очень субъективные ярлыки. Они отражают внутреннюю градацию
            конкретной организации в моменте, а не вашу абсолютную ценность на рынке. Не
            зацикливайтесь на титулах, концентрируйтесь на Expertise.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">💡 О статусе</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Работа в Microsoft или Яндексе не делает вас автоматически гением. Можно в Google
            заниматься полной ерундой, просиживая штаны, а в маленькой неизвестной студии — делать
            прорывные вещи. Среда важна, но она не определяет вашу личную крутость и экспертизу.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">💡 О профессии</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Программирование — это не просто «писать код». Это комплексная деятельность:
            проектирование, реализация, отладка, тестирование и, конечно, коммуникация. Каждый
            адекватный программист — отчасти бизнес-аналитик, тестировщик, дизайнер и архитектор.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">Вывод?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Отрасль не стоит на месте. Единственная постоянная вещь в ней — это изменение.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            И да. Я все еще в деле. Мне все еще безумно нравится.
          </p>
        </div>
      </article>
    </>
  );
}
