import { Icon, IconButton, Link, Tooltip } from "@chakra-ui/react";
import React from "react";
import { CustomIconButtonProps } from "../../chakra";
import { useTransactionStore } from "../../store";

// TODO add Solana Explorer support - user get to pick in options

export const ExplorerButton: React.FC<
  {
    value: string;
    valueType: "tx" | "account";
  } & CustomIconButtonProps
> = ({ value, type, ...theRest }) => {
  const network = useTransactionStore(
    (state) => state.transactionOptions.network.id
  );
  const href = `https://solscan.io/${type}/${value}?cluster=${network}`;
  const button = (
    <IconButton
      size="sm"
      variant="ghost"
      icon={<SolscanIcon />}
      aria-label="Open in Solscan"
      {...theRest}
    />
  );

  return (
    <Tooltip label="Open in Solscan" isDisabled={theRest.isDisabled}>
      {theRest.isDisabled ? (
        <Link>{button}</Link>
      ) : (
        <Link href={href} isExternal>
          {button}
        </Link>
      )}
    </Tooltip>
  );
};

const SolscanIcon: React.FC = () => (
  <Icon width="3" height="3" viewBox="0 0 16 16">
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
