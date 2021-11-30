import Vue, {VueConstructor} from 'vue'

/**
 * @FYI https://www.yuque.com/docs/share/a72a1b84-c0e4-4bd5-853f-6711cb08a507
 */
declare module '@en777/vue-get-code' {
  class VueComponent extends Vue {
    static install(vue: typeof Vue): void
  }

  type CombinedVueInstance<
    Instance extends Vue,
    Data,
    Methods,
    Computed,
    Props
  > = Data & Methods & Computed & Props & Instance

  type ExtendedVue<
    Instance extends Vue,
    Data,
    Methods,
    Computed,
    Props
  > = VueConstructor<
    CombinedVueInstance<Instance, Data, Methods, Computed, Props> & Vue
  >

  type Combined<Data, Methods, Computed, Props> = Data &
    Methods &
    Computed &
    Props

  type VueGetCodeData = {}

  type VueGetCodeMethods = {}

  type VueGetCodeComputed = {}

  type VueGetCodeProps = {}

  type VueGetCode = Combined<
    VueGetCodeData,
    VueGetCodeMethods,
    VueGetCodeComputed,
    VueGetCodeProps
  >

  export interface VueGetCodeType extends VueComponent, VueGetCode {}

  const VueGetCodeConstruction: ExtendedVue<
    Vue,
    VueGetCodeData,
    VueGetCodeMethods,
    VueGetCodeComputed,
    VueGetCodeProps
  >

  export default VueGetCodeConstruction
}
