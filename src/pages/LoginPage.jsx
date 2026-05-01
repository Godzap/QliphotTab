import DataPadLoginExperience from '../components/auth/DataPadLoginExperience'

const TERMINAL_ID = 'TRM-LC-R2-09'
const BUILD_VERSION = 'v4.7.1-stable'

export default function LoginPage() {
  return <DataPadLoginExperience terminalId={TERMINAL_ID} redirectPath="/tablet/home" buildVersion={BUILD_VERSION} />
}
