'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import infoSvg from 'components/pages/partners/apply/images/info.svg';
import Button from 'components/shared/button/button';
import Link from 'components/shared/link/link';
import Tooltip from 'components/shared/tooltip';
import LINKS from 'constants/links';

import AddIcon from '../images/add.inline.svg';

import Field from './field';
import Select from './select';

const CALLBACK_URLS_LIMIT = 3;

const integrationTypeOptions = [
  { id: 'oauth', name: 'OAuth' },
  { id: 'api', name: 'API' },
];

const applicationScopeOptions = [
  { id: 'create', name: 'Create projects' },
  { id: 'read', name: 'Read projects' },
  { id: 'modify', name: 'Modify projects' },
  { id: 'delete', name: 'Delete projects' },
];

const projectNumberOptions = [
  { id: '1000', name: '1000 projects' },
  { id: '5000', name: '5000 projects' },
  { id: '5000+', name: '5000+ projects' },
];

const useFilteredItems = (items, query) =>
  useMemo(
    () =>
      query === ''
        ? items
        : items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  );

const Form = ({ className }) => {
  const [integrationType, setIntegrationType] = useState(integrationTypeOptions[0]);
  const [integrationQuery, setIntegrationQuery] = useState('');

  const [projectNumber, setProjectNumber] = useState(projectNumberOptions[0]);
  const [projectNumberQuery, setProjectNumberQuery] = useState('');

  const [applicationScopes, setApplicationScopes] = useState([]);

  const [shouldAddCallbackUrl, setShouldAddCallbackUrl] = useState(true);

  const filteredIntegrationItems = useFilteredItems(integrationTypeOptions, integrationQuery);
  const filteredProjectNumberItems = useFilteredItems(projectNumberOptions, projectNumberQuery);

  const handleAddingCallbackUrl = () => {
    const callbackUrls = document.querySelectorAll('[data-label="callbackUrl"]');
    const callbackUrlsCount = callbackUrls.length;

    if (callbackUrlsCount < CALLBACK_URLS_LIMIT) {
      const lastCallbackUrl = callbackUrls[callbackUrlsCount - 1];
      const newCallbackUrl = lastCallbackUrl.cloneNode(true);
      const newCallbackUrlNumber = callbackUrlsCount + 1;
      newCallbackUrl.id = `callbackUrl${newCallbackUrlNumber}`;
      newCallbackUrl.name = `callbackUrl${newCallbackUrlNumber}`;
      newCallbackUrl.value = '';

      // add new callback url after the last one
      lastCallbackUrl.after(newCallbackUrl);
    }

    if (callbackUrlsCount === CALLBACK_URLS_LIMIT - 1) {
      setShouldAddCallbackUrl(false);
    }
  };

  return (
    <form
      className={clsx(className, 'flex flex-col gap-y-6 rounded-[10px] bg-gray-new-8 px-9 py-11')}
    >
      <Select
        label="What type of integration do you need? *"
        selected={integrationType}
        setSelected={setIntegrationType}
        setQuery={setIntegrationQuery}
        items={filteredIntegrationItems}
      />

      <div className="grid grid-cols-2 gap-5">
        <Field label="First Name *" name="firstName" placeholder="Marques" />
        <Field label="Last Name *" name="lastName" placeholder="Hansen" />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <Field label="Email *" name="email" type="email" placeholder="info@acme.com" />
        <Field label="Company Name *" name="companyName" placeholder="Acme" />
      </div>
      {integrationType.id === 'oauth' && (
        <>
          <Field
            label="App Name"
            name="appName"
            tooltipId="app-name-tooltip"
            tooltipContent="This is a tooltip!"
          />

          <fieldset className="flex flex-col">
            <legend className="items-centers flex" htmlFor="firstName">
              Callback URLs {/* TODO: add tooltip */}
              <a
                className="ml-1.5 flex items-center"
                id="callback-urls-tooltip"
                data-tooltip-content="This is a tooltip!"
              >
                <img src={infoSvg} width={14} height={14} alt="" loading="lazy" aria-hidden />
              </a>
              <Tooltip anchorSelect="#callback-urls-tooltip" />
            </legend>
            <input
              className="mt-3 h-10 appearance-none rounded border border-transparent bg-white bg-opacity-[0.04] px-4 transition-colors duration-200 placeholder:text-gray-new-40 hover:border-gray-new-15 focus:border-gray-new-15 focus:outline-none active:border-gray-new-15"
              id="callbackUrl"
              name="callbackUrl"
              data-label="callbackUrl"
              type="text"
            />
            <button
              className={clsx(
                'mt-3 flex items-center gap-x-2',
                shouldAddCallbackUrl ? 'text-green-45' : 'cursor-not-allowed text-gray-new-40'
              )}
              type="button"
              onClick={handleAddingCallbackUrl}
            >
              <AddIcon />
              Add another URL
            </button>
          </fieldset>

          <fieldset>
            <legend>Will you be making API calls from a backend?</legend>
            <div className="mt-3 flex items-center gap-x-8">
              <label className="flex items-center gap-x-[9px]" htmlFor="apiCallsYes">
                <input
                  className="h-2 w-2 appearance-none rounded-full bg-transparent outline outline-1 outline-offset-2 outline-gray-new-40 checked:bg-primary-1"
                  type="radio"
                  name="apiCalls"
                  id="apiCallsYes"
                  value="yes"
                />
                Yes
              </label>

              <label className="flex items-center gap-x-[9px]" htmlFor="apiCallsNo">
                <input
                  className="h-2 w-2 appearance-none rounded-full bg-transparent outline outline-1 outline-offset-2 outline-gray-new-40 checked:bg-primary-1"
                  type="radio"
                  name="apiCalls"
                  id="apiCallsNo"
                  value="no"
                />
                No
              </label>
            </div>
          </fieldset>
          <Select
            label="What application scope would you need?"
            items={applicationScopeOptions}
            selected={applicationScopes}
            setSelected={setApplicationScopes}
            multiple
          />

          <Field
            label="Link to logo"
            name="linkToLogo"
            tooltipId="link-to-logo-tooltip"
            tooltipContent="This is a tooltip!"
          />
        </>
      )}
      {integrationType.id === 'api' && (
        <Select
          label="Number of projects you need"
          selected={projectNumber}
          setSelected={setProjectNumber}
          setQuery={setProjectNumberQuery}
          items={filteredProjectNumberItems}
        />
      )}

      <Field
        label="Additional details"
        name="additionalDetails"
        tag="textarea"
        placeholder="Message"
      />
      <Button
        className="mt-3 h-[52px] py-[17px] text-lg font-medium leading-none tracking-[-0.02em]"
        theme="primary"
        type="submit"
      >
        Apply now
      </Button>
      <p className="text-[15px] font-light leading-snug">
        By submitting you agree to the{' '}
        <Link
          className="text-green-45 underline decoration-green-45/40 decoration-1 underline-offset-[3px] transition-colors duration-200 hover:decoration-transparent"
          to={LINKS.termsOfService}
        >
          Terms Service
        </Link>{' '}
        and acknowledge the{' '}
        <Link
          className="inline-block text-green-45 underline decoration-green-45/40 decoration-1 underline-offset-[3px] transition-colors hover:decoration-transparent"
          to={LINKS.privacyPolicy}
        >
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
};

Form.propTypes = {
  className: PropTypes.string,
};

export default Form;
