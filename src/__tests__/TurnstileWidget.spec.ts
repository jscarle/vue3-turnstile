import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TurnstileWidget, TurnstileOptionsKey } from '../index'
import type { Turnstile } from '../turnstile.ts'

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

  it('does not re-render when modelValue changes', async () => {
    const wrapper = mount(TurnstileWidget, {
      props: { sitekey: 'test-key', modelValue: null },
    })
    await flushPromises()
    const win = window as unknown as { turnstile: Turnstile }
    const renderSpy = vi.spyOn(win.turnstile, 'render')
    await wrapper.setProps({ modelValue: 'token' })
    await flushPromises()
    expect(renderSpy).toHaveBeenCalledTimes(1)
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
})
