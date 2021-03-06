import { RouteProp, NavigationState } from '@react-navigation/core'
import { ParamListBase } from '@react-navigation/native'

export interface _RouteProps extends RouteProp<ParamListBase, string>{
  state:NavigationState
}

export default {
  navigate: (navigation: { navigate: (arg0: any, arg1: any) => void; }, routeName: string, params: object| { }) => {
    console.log('routes.ts navigate routeName=', routeName, ' params=', params)
    navigation.navigate(routeName, params)
  },
  push: (navigation: any, routeName: string, params: object) => {
    console.log('routes.js push routeName=', routeName, ' params=', params)
    navigation.push(routeName, params)
  },
  goBack: (navigation: { goBack: () => void; }) => {
    navigation.goBack()
  },
  reset: (navigation: { reset: (arg0: { routes: { name: any; }[]; }) => void; }, routeName: string) => {
    navigation.reset({
      routes: [{ name: routeName }]
    })
  }
}
