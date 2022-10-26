import { Reader, useStripeTerminal } from '@stripe/stripe-terminal-react-native'
import { useEffect } from 'react'
import { Pressable, SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import { Box, Button, Divider, Text } from '../../modules/common'
import { DiscoveredReader } from '../../modules/readers'
import { ActionScreenProps } from '../../types'

const LOCATION_ID = process.env.LOCATION_ID

const ReaderSettings = ({
  navigation,
}: ActionScreenProps<'ReaderSettings'>) => {
  const {
    connectedReader,
    discoverReaders,
    discoveredReaders,
    connectBluetoothReader,
    cancelDiscovering,
    disconnectReader,
  } = useStripeTerminal()

  useEffect(() => {
    handleDiscoverReaders()
  }, [])

  const handleDiscoverReaders = async () => {
    // The list of discovered readers is reported in the `didUpdateDiscoveredReaders` method
    // within the `useStripeTerminal` hook.
    const { error } = await discoverReaders({
      discoveryMethod: 'bluetoothScan',
    })

    // if (error) {
    //   Alert.alert('Discover readers error: ', `${error.code}, ${error.message}`)
    // }
  }

  const handleConnectBluetoothReader = async (selectedReader: Reader.Type) => {
    const { reader, error } = await connectBluetoothReader({
      reader: selectedReader,
      locationId: LOCATION_ID,
    })

    if (error) {
      console.log('connectBluetoothReader error', error)
      return
    }

    console.log('Reader connected successfully', reader)
  }

  const handleDisonnectReader = async () => {
    const result = await disconnectReader()

    if (result?.error) {
      console.log('disconnectReader error', result.error)
      return
    }

    console.log('Reader disconnected successfully')
  }

  return (
    <Box px="l" pt="xl" backgroundColor="background" style={styles.container}>
      <SafeAreaView>
        <Text variant="xlarge" weight="semibold">
          Connected terminal
        </Text>
        <Box mt="base">
          {connectedReader ? (
            <Pressable onPress={handleDisonnectReader}>
              <DiscoveredReader reader={connectedReader} />
            </Pressable>
          ) : (
            <Text color="textPlaceholder">No connected terminal</Text>
          )}
        </Box>
      </SafeAreaView>
      <Box mt="xl">
        <Text variant="large" weight="semibold">
          Available terminals
        </Text>
      </Box>
      <Box mt="base" mb="l">
        <Divider width={32} />
      </Box>
      <ScrollView>
        {discoveredReaders.map((reader) => (
          <Button
            backgroundColor="background"
            key={reader.serialNumber}
            onPress={() => handleConnectBluetoothReader(reader)}
          >
            <DiscoveredReader reader={reader} />
          </Button>
        ))}
      </ScrollView>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  discoverArea: {
    flex: 1,
  },
})

export default ReaderSettings
