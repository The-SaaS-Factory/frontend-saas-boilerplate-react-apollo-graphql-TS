import { useTranslation } from 'react-i18next';
const Building = () => {
  const { t } = useTranslation('misc');
  return (
    <div>
         <div className="flex flex-col mb-10 ">
            <img className="max-h-96 w-96 mx-auto" src="/assets/img/block.png" alt="not_found" />
            <h1 className="title text-center">
             {t('building.part1')} <br /> {t('building.part2')}
            </h1>
          
          </div>
    </div>
  )
}

export default Building