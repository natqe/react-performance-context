import { createContext, FC, ProviderProps, useContext, useRef } from "react"

type Hooks<Type> = {
  [Property in keyof Type]: () => Type[Property]
}

export const createObjectContext = <T extends { [key: string]: any },>(defaultValue: T, displayName = `ObjectContext`) => {
  const Ctx = createContext(defaultValue)
  Ctx.displayName = displayName
  const hooks = {} as Hooks<T>
  const providers = []
  for (const [key, value] of Object.entries(defaultValue)) {
    const PropCtx = createContext(value)
    PropCtx.displayName = `${key}Context`
    hooks[key as keyof typeof hooks] = () => useContext(PropCtx)
    const Provider = ({ children }) => {
      const { [key]: value } = useContext(Ctx)
      return <PropCtx.Provider {...{ value }}>{children}</PropCtx.Provider>
    }
    Provider.displayName = `${key}ContextWrapper`
    providers.push(Provider)
  }
  const Provider: FC<ProviderProps<T>> = ({ children, value, ...props }) => {
    return <Ctx.Provider {...{ value }} {...props}>
      {providers.reduceRight((acc, Comp) => <Comp>{acc}</Comp>, children)}
    </Ctx.Provider>
  }
  Provider.displayName = `${displayName}Wrapper`
  return {
    Provider,
    use<T extends { [0]: keyof typeof hooks } & ReadonlyArray<keyof typeof hooks>>(...prop: T) {
      const initialArgs = useRef(prop)
      const result = {} as {
        [key in typeof prop[number]]: ReturnType<typeof hooks[key]>
      }
      for (const key of initialArgs.current) result[key] = hooks[key]()
      return result
    }
  }
}

export default createObjectContext