import { Icon, IconButton, Link, Tooltip } from "@chakra-ui/react";
import React from "react";
import { CustomIconButtonProps } from "../../chakra";
import { useTransactionStore } from "../../hooks/useTransactionStore";

export type AddressType = "tx" | "account";

// TODO add solana.fm support

const explorerOpts: Record<string, any> = {
  solscan: {
    label: "Open in Solscan",
    url: (valueType: AddressType, value: string, network: string) =>
      `https://solscan.io/${valueType}/${value}?cluster=${network}`,
  },
  solana: {
    label: "Open in Solana Explorer",
    url: (valueType: AddressType, value: string, network: string) =>
      `https://explorer.solana.com/${
        valueType === "account" ? "address" : valueType
      }/${value}?cluster=${network}`,
  },
};

export const ExplorerButton: React.FC<
  {
    value: string;
    valueType: AddressType;
  } & CustomIconButtonProps
> = ({ value, valueType, size, ...theRest }) => {
  const explorer = useTransactionStore((state) => state.appOptions.explorer);
  const network = useTransactionStore(
    (state) => state.transactionOptions.network.id
  );

  if (explorer === "none") return null; // hide
  const opts = explorerOpts[explorer];

  const button = (
    <IconButton
      variant="ghost"
      icon={
        explorer === "solscan" ? (
          <SolscanIcon size={size} />
        ) : (
          <SolanaExplorerIcon size={size} />
        )
      }
      aria-label={opts.label}
      size={size}
      {...theRest}
    />
  );

  return (
    <Tooltip label={opts.label} isDisabled={theRest.isDisabled}>
      {theRest.isDisabled ? (
        <Link>{button}</Link>
      ) : (
        <Link href={opts.url(valueType, value, network)} isExternal>
          {button}
        </Link>
      )}
    </Tooltip>
  );
};

const SolscanIcon: React.FC<{ size: any }> = ({ size }) => (
  <Icon
    w={size === "xs" ? 3 : size === "sm" ? 4 : 5}
    h={size === "xs" ? 3 : size === "sm" ? 4 : 5}
    viewBox="0 0 16 16"
  >
    <path
      d="m 8.021296,4.8390002 c 1.7612,0.016 3.1512,1.43932 3.1263,3.1999 -0.025,1.76122 -1.4605,3.1505998 -3.2147,3.1115998 -1.7343,-0.0384 -3.0943,-1.4310198 -3.0898,-3.1634398 0.0045,-1.75994 1.4214,-3.16406 3.1782,-3.14806 z"
      fill="#c74ae3"
      id="path44"
    />
    <path
      d="m 12.117696,14.7319 c -2.7513,2.2156 -7.6676,1.4227 -10.2141,-1.559 -2.80119999,-3.2798898 -2.47409999,-8.2006898 0.7386,-11.1145198 3.1736,-2.87798497 8.0835,-2.71927097 11.0767,0.35839 2.9055,2.98742 3.0342,7.9440298 0.3149,10.7414298 -0.6349,-0.665 -1.2704,-1.3312 -1.9366,-2.0288 1.031,-1.4411798 1.3504,-3.0904098 0.7341,-4.8612298 -0.9203,-2.64376 -3.8354,-4.03891 -6.4939,-3.13782 -2.6271,0.89021 -4.0651,3.71828 -3.2447,6.38059 0.8294,2.6917598 3.6428,4.2206598 6.3429,3.3912598 0.5374996,-0.1651 0.8358,-0.0685 1.1833,0.3315 0.4595,0.5299 0.9913,0.9971 1.4988,1.4982 z"
      fill="#00e8b5"
      id="path46"
    />
  </Icon>
);

const SolanaExplorerIcon: React.FC<{ size: any }> = ({ size }) => (
  <Icon
    w={size === "xs" ? 3 : size === "sm" ? 4 : 5}
    h={size === "xs" ? 3 : size === "sm" ? 4 : 5}
    mt="1"
    ml="1"
    viewBox="0 0 16 16"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="m 2.1360235,8.473284 c 0.03974,-0.04273 0.08776,-0.07707 0.141181,-0.100939 0.05345,-0.02387 0.111152,-0.03678 0.169731,-0.03797 h 9.7687335 c 0.04133,5.82e-4 0.0816,0.01299 0.115993,0.03577 0.0344,0.02278 0.06144,0.05493 0.07784,0.09258 0.01643,0.03768 0.02154,0.07924 0.01474,0.119724 -0.0068,0.04048 -0.02527,0.07813 -0.05313,0.108453 l -2.070655,2.282692 c -0.03974,0.04273 -0.08776,0.07707 -0.141182,0.100939 -0.05342,0.02386 -0.111151,0.03678 -0.1697035,0.03797 H 0.21462048 c -0.04133,-5.82e-4 -0.08162,-0.01299 -0.115994,-0.03577 -0.0344,-0.02278 -0.06144,-0.05493 -0.07787,-0.09258 -0.0164,-0.03768 -0.0215099996,-0.07924 -0.01471,-0.119724 0.0068,-0.04048 0.02527,-0.07813 0.05313,-0.108453 z M 12.380425,6.581063 c 0.02789,0.03032 0.04633,0.068 0.05313,0.108479 0.0068,0.04048 0.0017,0.08205 -0.01471,0.119698 -0.01643,0.03768 -0.04347,0.06982 -0.07784,0.09258 -0.0344,0.02278 -0.07469,0.03519 -0.11602,0.03577 L 2.4531555,6.94529 C 2.3945755,6.94409 2.3368715,6.93119 2.2834255,6.90732 2.2300055,6.88345 2.1819845,6.84911 2.1422435,6.806382 L 0.05605748,4.531415 c -0.02786,-0.03032 -0.0463,-0.068 -0.05313,-0.108479 -0.0068,-0.04048 -0.0017,-0.08205 0.01474,-0.119698 0.01643,-0.03768 0.04344,-0.06982 0.07784,-0.09258 0.0344,-0.02278 0.07467,-0.03519 0.115993,-0.03577 l 9.77185702,-0.0077 c 0.058549,0.0012 0.1162835,0.0141 0.1697025,0.03797 0.05342,0.02386 0.101442,0.05821 0.141182,0.100938 z M 2.1360235,0.138909 c 0.03974,-0.04273 0.08776,-0.07707 0.141181,-0.100939 C 2.3306545,0.0141 2.3883565,0.00119 2.4469355,0 l 9.7749505,0.0077 c 0.04133,5.83e-4 0.0816,0.01299 0.115994,0.03577 0.0344,0.02275 0.06141,0.0549 0.07784,0.09258 0.01643,0.03765 0.02154,0.07922 0.01474,0.119697 -0.0068,0.04048 -0.02527,0.07816 -0.05313,0.108479 l -2.076873,2.274967 c -0.03974,0.04273 -0.08776,0.07707 -0.141182,0.100939 -0.05342,0.02387 -0.111151,0.03678 -0.1697035,0.03797 H 0.21462048 c -0.04133,-5.83e-4 -0.08162,-0.01299 -0.115994,-0.03577 -0.0344,-0.02278 -0.06144,-0.05493 -0.07787,-0.09258 -0.0164,-0.03768 -0.0215099996,-0.07924 -0.01471,-0.119724 0.0068,-0.04048 0.02527,-0.07813 0.05313,-0.108452 z"
      fill="#14f195"
      id="path14"
      // style="stroke-width:0.264583"
    />
  </Icon>
);
