import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { Link } from 'react-router';
import { defineMessages, intlShape } from 'react-intl';

// import { sortableContainer } from '../react-sortable-multiple-hoc';

import SearchInput from '../../ui/SearchInput';
import Infobox from '../../ui/Infobox';
import Loader from '../../ui/Loader';
import ServiceItem from './ServiceItem';
import Appear from '../../ui/effects/Appear';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import EditInPlace from '../../ui/EditInPlace';
import SortableComponent from './SortableComponent';

// console.log(sortableContainer)

const messages = defineMessages({
  headline: {
    id: 'settings.services.headline',
    defaultMessage: '!!!Your services',
  },
  searchService: {
    id: 'settings.searchService',
    defaultMessage: '!!!Search service',
  },
  noServicesAdded: {
    id: 'settings.services.noServicesAdded',
    defaultMessage: '!!!You haven\'t added any services yet.',
  },
  noServiceFound: {
    id: 'settings.recipes.nothingFound',
    defaultMessage: '!!!Sorry, but no service matched your search term.',
  },
  discoverServices: {
    id: 'settings.services.discoverServices',
    defaultMessage: '!!!Discover services',
  },
  servicesRequestFailed: {
    id: 'settings.services.servicesRequestFailed',
    defaultMessage: '!!!Could not load your services',
  },
  tryReloadServices: {
    id: 'settings.account.tryReloadServices',
    defaultMessage: '!!!Try again',
  },
  updatedInfo: {
    id: 'settings.services.updatedInfo',
    defaultMessage: '!!!Your changes have been saved',
  },
  deletedInfo: {
    id: 'settings.services.deletedInfo',
    defaultMessage: '!!!Service has been deleted',
  },
});

@observer
export default class ServicesDashboard extends Component {
  static propTypes = {
    services: MobxPropTypes.arrayOrObservableArray.isRequired,
    isLoading: PropTypes.bool.isRequired,
    toggleService: PropTypes.func.isRequired,
    filterServices: PropTypes.func.isRequired,
    resetFilter: PropTypes.func.isRequired,
    goTo: PropTypes.func.isRequired,
    servicesRequestFailed: PropTypes.bool.isRequired,
    retryServicesRequest: PropTypes.func.isRequired,
    status: MobxPropTypes.arrayOrObservableArray.isRequired,
    searchNeedle: PropTypes.string,
  };

  static defaultProps = {
    searchNeedle: '',
  }

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      services,
      serviceGroups,
      reorder,
      isLoading,
      toggleService,
      filterServices,
      resetFilter,
      goTo,
      servicesRequestFailed,
      retryServicesRequest,
      status,
      searchNeedle,
      createServiceGroup,
      deleteServiceGroup,
    } = this.props;
    const { intl } = this.context;

    return (
      <div className="settings__main">
        <div className="settings__header">
          <h1>{intl.formatMessage(messages.headline)}</h1>
        </div>
        <div className="settings__body">
          {!isLoading && (
            <SearchInput
              placeholder={intl.formatMessage(messages.searchService)}
              onChange={needle => filterServices({ needle })}
              onReset={() => resetFilter()}
              autoFocus
            />
          )}
          {!isLoading && servicesRequestFailed && (
            <div>
              <Infobox
                icon="alert"
                type="danger"
                ctaLabel={intl.formatMessage(messages.tryReloadServices)}
                ctaLoading={isLoading}
                ctaOnClick={retryServicesRequest}
              >
                {intl.formatMessage(messages.servicesRequestFailed)}
              </Infobox>
            </div>
          )}

          {status.length > 0 && status.includes('updated') && (
            <Appear>
              <Infobox
                type="success"
                icon="checkbox-marked-circle-outline"
                dismissable
              >
                {intl.formatMessage(messages.updatedInfo)}
              </Infobox>
            </Appear>
          )}

          {status.length > 0 && status.includes('service-deleted') && (
            <Appear>
              <Infobox
                type="success"
                icon="checkbox-marked-circle-outline"
                dismissable
              >
                {intl.formatMessage(messages.deletedInfo)}
              </Infobox>
            </Appear>
          )}

          {!isLoading && services.length === 0 && !searchNeedle && (
            <div className="align-middle settings__empty-state">
              <p className="settings__empty-text">
                <span className="emoji">
                  <img src="./assets/images/emoji/sad.png" alt="" />
                </span>
                {intl.formatMessage(messages.noServicesAdded)}
              </p>
              <Link to="/settings/recipes" className="button">{intl.formatMessage(messages.discoverServices)}</Link>
            </div>
          )}
          {!isLoading && services.length === 0 && searchNeedle && (
            <div className="align-middle settings__empty-state">
              <p className="settings__empty-text">
                <span className="emoji">
                  <img src="./assets/images/emoji/dontknow.png" alt="" />
                </span>
                {intl.formatMessage(messages.noServiceFound)}
              </p>
            </div>
          )}
          {isLoading ? (
            <Loader />
          ) : (
            <table className="service-table">
              <tbody>
                {services.map(service => (
                  <ServiceItem
                    key={service.id}
                    service={service}
                    toggleAction={() => toggleService({ serviceId: service.id })}
                    goToServiceForm={() => goTo(`/settings/services/edit/${service.id}`)}
                  />
                ))}
              </tbody>
            </table>
          )}
          {/* <Button
            label="Create"
            className=""
            onClick={createServiceGroup}
          /> */}
          <div>
            {/* {serviceGroups.map(serviceGroup => (serviceGroup.group &&
              <div key={serviceGroup.group.id}>
                <span className="service-group--name">{serviceGroup.group.name}</span>
                <span
                  onClick={() => deleteServiceGroup(serviceGroup.group.id)}
                  className="mdi mdi-delete"
                />
              </div>
            ))} */}
          </div>
          <EditInPlace
            onSave={createServiceGroup}
            placeholder="New Group"
          />
          <SortableComponent
            // items={toJS(services)}
            groups={serviceGroups}
            reorder={reorder}
          />
        </div>
      </div>
    );
  }
}
