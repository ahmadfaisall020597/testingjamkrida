import { Breadcrumb, Container } from 'react-bootstrap';
import { FaHome } from 'react-icons/fa';
import { Link, useLocation } from 'react-router';
import objectRouter from 'src/utils/router/objectRouter';

const formatBreadcrumb = (breadcrumb) => {
  let splitUnderscore = breadcrumb.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return splitUnderscore.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};


const createBreadcrumbs = (pathnames, name, index) => {
  const translations = JSON.parse(localStorage.getItem('translation_data')) || {};
  console.log('lang : ', translations);
  const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
  const isFirst = index === 0;
  const isLast = index === pathnames.length - 1;
  const getTranslatedBreadcrumb = (key) => {
    const toCamelCaseKey = (str) => {
      const words = str.trim().replace(/[_\- ]+/g, ' ').split(' ');
      return words
        .map((word, index) =>
          index === 0
            ? word.charAt(0).toLowerCase() + word.slice(1)
            : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join('');
    };

    const toTitleCaseWithSpaces = (str) => {
      return str
        .trim()
        .replace(/[_\-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };

    const pascalKey = toCamelCaseKey(key);
    console.log('pascalKey : ', pascalKey);
    const translationData = JSON.parse(localStorage.getItem('translation_data')) || {};
    const activeLang = localStorage.getItem('selectedLanguage');
    const langTranslations = translationData[activeLang];

    if (
      langTranslations &&
      langTranslations[pascalKey] &&
      langTranslations[pascalKey].text1
    ) {
      return langTranslations[pascalKey].text1;
    }

    return toTitleCaseWithSpaces(key);
  };

  const label = getTranslatedBreadcrumb(name);
  return isLast ? (
    <Breadcrumb.Item key={name} active>
      {label}
    </Breadcrumb.Item>)
    : (
      <Breadcrumb.Item key={name} linkAs={isFirst ? 'span' : Link} linkProps={{ to: routeTo }}>
        {label}
      </Breadcrumb.Item>
    )
};

const Breadcrumbs = () => {
  const location = useLocation()
  const path = location.pathname.split('/').filter((x) => x);

  return (
    <div className='px-sm-3 px-2' id="breadcrumbs">
      <Container fluid >
        <Breadcrumb>
          {
            (
              <Breadcrumb.Item key={path[0]} linkAs={Link} linkProps={{ to: objectRouter.dashboard.path }}>
                <FaHome color={'#000'} />
              </Breadcrumb.Item>
            )
          }
          {path?.map((name, index) => (
            createBreadcrumbs(path, name, index)
          ))}
        </Breadcrumb>
      </Container>
    </div>


  );
};

export default Breadcrumbs;
