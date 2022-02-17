import React, { useState, useEffect } from "react";
import {
	Button,
	Container,
	Navbar,
	NavbarBrand,
	Nav,
	UncontrolledDropdown,
	DropdownMenu,
	DropdownItem,
	DropdownToggle,
	Badge,
} from "reactstrap";
import { BsTwitter, BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/router";
import { connectTwitterAuth } from "../../_api/channels";
import { deleteSocialAccount, getSocialAccounts } from "../../_api/users";
import { useSession } from "next-auth/react";
import { objectToObjectsOfArray, capitalizeFirstLetter } from "../../utils/formatter";

function Channels() {
  const router = useRouter();
  const { data: session } = useSession({ required: true });
  const [accounts, setAccounts] = useState({});

  useEffect(() => {
    if (session && session.token) {
      getSocialAccounts(session.token?.sub).then(({ data }) => {
        setAccounts(data);
      });
    }
  }, [session]);

  const connectTwitter = () => {
    connectTwitterAuth().then(({ data }) =>
      window.location.replace(data.oauth_url)
    );
  };

	const handleDisconnect = (social_account_name = "twitter") => {
		deleteSocialAccount(session.token?.sub, social_account_name).then(
			({ data }) => {
				console.log(data);
				setAccounts((prevAccounts) => ({
					...prevAccounts,
					[social_account_name]: false,
				}));
			}
		);
	};
	console.log(accounts);
	return (
		<React.Fragment>
			<Navbar color='white' light expand='md'>
				<NavbarBrand className='pl-4 font-weight-bold'>Channels</NavbarBrand>
				<Button
					color='primary'
					className='mb-3'
					outline
					style={{ marginLeft: "auto", marginRight: 15 }}
					className='px-4'
					size='sm'
					onClick={() => router.back()}
				>
					Back
				</Button>
			</Navbar>
			<Container
				style={{ height: "calc(100vh - 65px)" }}
				className='d-flex align-items-center justify-content-center'
				fluid
			>
				<div
					style={{ width: "740px" }}
					className='d-flex flex-wrap flex-row align-items-center justify-content-center'
				>
					{[...objectToObjectsOfArray(accounts)].map(
						({ account, isconnected, social_icon }, index) => {
							return (
								<div
									key={index}
									className='mb-3 shadow-lg position-relative p-2 mx-2'
									style={{
										width: "200px",
									}}
								>
									{isconnected && (
										<UncontrolledDropdown
											direction='down'
											menuRole='listbox'
											style={{
												position: "absolute",
												top: 10,
												right: 5,
											}}
										>
											<DropdownToggle
												style={{ padding: 0, boxShadow: "none" }}
												color='secondary'
												id='dropdownMenuButton'
											>
												<BsThreeDotsVertical
													style={{ fontSize: 18, color: "black" }}
												/>
											</DropdownToggle>
											<DropdownMenu
												persist
												style={{ padding: 0 }}
												aria-labelledby='dropdownMenuButton'
											>
												<DropdownItem onClick={() => handleDisconnect(account)}>
													Disconnect account
												</DropdownItem>
											</DropdownMenu>
										</UncontrolledDropdown>
									)}
									<section className='d-flex flex-column align-items-center justify-items-center'>
										<span
											style={{
												color: social_icon?.color,
												height: "40px",
												marginTop: "0.25rem",
												background: social_icon?.bg_color,
												minWidth: "40px",
												borderRadius: "50%",
											}}
											className='d-flex flex-row align-items-center justify-content-center mt-3'
										>
											{social_icon?.icon}
										</span>
										<main
											className='mt-3'
											style={{ textAlign: "center", width: "100%" }}
										>
											<h2
												className='mb-0 font-weight-bold'
												style={{ color: "black" }}
											>
												{capitalizeFirstLetter(account)}
											</h2>
											<p
												style={{ fontSize: "14px" }}
												className='text-dark pt-0 mt-0'
											>
												Profile
											</p>
										</main>
										{!isconnected && (
											<Button
												className='font-weight-bold px-3 mb-3 rounded-sm'
												onClick={connectTwitter}
												color='primary'
												size='sm'
												outline
											>
												Connect
											</Button>
										)}
										{isconnected && (
											<Badge
												style={{ marginBottom: "20px" }}
												color='danger'
												className='badge-md'
											>
												connected
											</Badge>
										)}
									</section>
								</div>
							);
						}
					)}
				</div>
			</Container>
		</React.Fragment>
	);
}

Channels.requireAuth = true;

export default Channels;
