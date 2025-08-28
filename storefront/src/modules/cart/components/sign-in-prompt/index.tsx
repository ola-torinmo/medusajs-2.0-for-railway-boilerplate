import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="bg-[#F9F5F2] flex items-center justify-between">
      <div>
        <Heading level="h2" className="txt-xlarge">
         <h2> Already have an account? </h2>
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle mt-2">
         <p>Sign in for a better experience.</p>
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button variant="secondary" className="h-10" data-testid="sign-in-button">
           <h3> Sign in </h3>
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
