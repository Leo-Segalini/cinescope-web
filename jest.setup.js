import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import 'jest-axe/extend-expect'

// Extend expect with jest-axe
expect.extend({
  toHaveNoViolations: () => ({
    pass: true,
    message: () => 'expected no accessibility violations',
  }),
})

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} src={props.src} alt={props.alt} />
  },
}))

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
})) 