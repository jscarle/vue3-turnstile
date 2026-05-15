import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TurnstileWidget, TurnstileOptionsKey } from '../index'
import type { Turnstile } from '../turnstile'

vi.mock('@unhead/vue', () => ({
  useScript: () => ({
    load: vi.fn().mockResolvedValue(undefined),
    warmup: vi.fn(),
  }),
}))

beforeEach(() => {
  ;(window as unknown as { turnstile: Turnstile }).turnstile = {
    render: vi.fn().mockReturnValue('widget-id'),
    reset: vi.fn(),
    remove: vi.fn(),
    execute: vi.fn(),
  }
})

describe('TurnstileWidget', () => {
  it('mounts and exposes methods', async () => {
    const wrapper = mount(TurnstileWidget, {
      props: { sitekey: 'test-key', modelValue: null },
    })
    await flushPromises()
    const win = window as unknown as { turnstile: Turnstile }
    expect(win.turnstile.render).toHaveBeenCalled()
    const vm = wrapper.vm as InstanceType<typeof TurnstileWidget>
    expect(typeof vm.render).toBe('function')
    expect(typeof vm.reset).toBe('function')
    expect(typeof vm.execute).toBe('function')
    expect(typeof vm.remove).toBe('function')
  })

  it('uses provided options as defaults', async () => {
    const win = window as unknown as { turnstile: Turnstile }
    const renderSpy = vi.spyOn(win.turnstile, 'render')
    mount(TurnstileWidget, {
      props: { modelValue: null },
      global: {
        provide: {
          [TurnstileOptionsKey]: {
            sitekey: 'plugin-key',
            theme: 'dark',
          },
        },
      },
    })
    await flushPromises()
    expect(renderSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ sitekey: 'plugin-key', theme: 'dark' }),
    )
  })

  it('supports event-only usage without v-model', async () => {
    const win = window as unknown as { turnstile: Turnstile }
    const success = vi.fn()

    mount(TurnstileWidget, {
      props: { sitekey: 'test-key', onSuccess: success },
    })
    await flushPromises()

    const renderSpy = vi.mocked(win.turnstile.render)
    const renderOptions = renderSpy.mock.calls[0]?.[1]
    renderOptions?.callback?.('token')

    expect(success).toHaveBeenCalledWith('token')
  })

  it('rerenders when render options change', async () => {
    const win = window as unknown as { turnstile: Turnstile }
    const renderSpy = vi.mocked(win.turnstile.render)

    const wrapper = mount(TurnstileWidget, {
      props: { sitekey: 'first-key', modelValue: null },
    })
    await flushPromises()

    await wrapper.setProps({ sitekey: 'second-key' })
    await flushPromises()

    expect(win.turnstile.remove).toHaveBeenCalledWith('widget-id')
    expect(renderSpy).toHaveBeenCalledTimes(2)
    expect(renderSpy.mock.calls[1]?.[1]).toEqual(
      expect.objectContaining({ sitekey: 'second-key' }),
    )
  })

  it('does not rerender when only modelValue changes', async () => {
    const win = window as unknown as { turnstile: Turnstile }
    const renderSpy = vi.mocked(win.turnstile.render)

    const wrapper = mount(TurnstileWidget, {
      props: { sitekey: 'test-key', modelValue: null },
    })
    await flushPromises()

    await wrapper.setProps({ modelValue: 'token' })
    await flushPromises()

    expect(win.turnstile.remove).not.toHaveBeenCalled()
    expect(renderSpy).toHaveBeenCalledTimes(1)
  })

  it('does not render without a sitekey', async () => {
    const win = window as unknown as { turnstile: Turnstile }
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    mount(TurnstileWidget, {
      props: { modelValue: null },
    })
    await flushPromises()

    expect(win.turnstile.render).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith('Turnstile site key was not found.')

    warnSpy.mockRestore()
  })
})
