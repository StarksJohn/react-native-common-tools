export default {
  navigate: (navigation, routeName, params) => {
    console.log('routes.js navigate routeName=', routeName, ' params=', params);
    navigation.navigate(routeName, params);
  },
  push: (navigation, routeName, params) => {
    console.log('routes.js push routeName=', routeName, ' params=', params);
    navigation.push(routeName, params);
  },
  goBack: (navigation) => {
    navigation.goBack();
  },
  reset: (navigation, routeName) => {
    navigation.reset({
      routes: [{ name: routeName }],
    });
  },
};
