import React from "react";
import {MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Flex, useColorMode,IconButton } from "@chakra-ui/react";
import { useBoolean } from '@chakra-ui/react'

const Toggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [dark,setDark] =useBoolean()
  return (
    <div>
      <Flex align="center" justify="end" ml={4} onClick={() => toggleColorMode()} >
       <IconButton
       onClick={setDark.toggle}
  variant='outline'
  colorScheme='gray'
  aria-label='Call Sage'
  fontSize='20px'
  icon={dark ? <MoonIcon /> : <SunIcon />}
  />
      </Flex>
    </div>
  );
};

export default Toggle;