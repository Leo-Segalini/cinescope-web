import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import RootLayout from '../layout'
import Link from 'next/link'

describe('RootLayout', () => {
  it('should render without accessibility violations', async () => {
    const { container } = render(
      <RootLayout>
        <main>
          <h1>Test Content</h1>
          <p>This is a test paragraph.</p>
          <Link href="/" className="text-blue-500 hover:underline">
            Home
          </Link>
        </main>
      </RootLayout>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
}) 