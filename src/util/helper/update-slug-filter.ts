export const updateFilterSlug = (filter: any = {}) => {
  if (filter.slug) {
    /* eslint-disable no-param-reassign */
    filter.slug = { $regex: new RegExp(`${filter.slug}`, 'i') };
  }
};
