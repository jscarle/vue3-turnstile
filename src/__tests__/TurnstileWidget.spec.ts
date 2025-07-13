import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TurnstileWidget } from '../index'

vi.mock('@unhead/vue', () => ({
  useScript: () => ({
    load: vi.fn().mockResolvedValue(undefined),
    warmup: vi.fn(),
  }),
}))

beforeEach(() => {
  ;(window as any).turnstile = {
    render: vi.fn().mockReturnValue('widget-id'),
    reset: vi.fn(),
    remove: vi.fn(),
    execute: vi.fn(),
  }
})

describe('TurnstileWidget', () => {
  it('mounts and exposes methods', async () => {
    const wrapper = mount(TurnstileWidget, { props: { sitekey: 'test-key', modelValue: null } })
    await flushPromises()
    expect((window as any).turnstile.render).toHaveBeenCalled()
    expect(typeof (wrapper.vm as any).render).toBe('function')
    expect(typeof (wrapper.vm as any).reset).toBe('function')
    expect(typeof (wrapper.vm as any).execute).toBe('function')
    expect(typeof (wrapper.vm as any).remove).toBe('function')
  })
})
