import React from 'react'
import { Pane, Text, Button } from 'evergreen-ui'
import { Query } from 'react-apollo'
import { USER_GET, USER_GET_REPO } from '../models/graphQLqueries'

const User = () => {
	const variables = {
		login: 'majdi',
		cursor: null
	}

	return (
		<Query
			query={USER_GET_REPO}
			fetchPolicy="cache-and-network"
			variables={variables}>
			{({ loading, error, data: { user }, fetchMore }) => {
				if (loading) {
					return <span>=== WAIT === </span>
				}
				if (error) {
					return <span>=== ERROOOOOR === </span>
				}

				const { pageInfo } = user.repositories

				return (
					<Pane
						elevation={1}
						float="left"
						backgroundColor="white"
						width={420}
						height={240}
						margin={24}
						display="flex"
						justifyContent="center"
						alignItems="center"
						flexDirection="column">
						<Text>
							<strong>{user.name}</strong>
						</Text>
						<Button
							marginRight={16}
							appearance="minimal"
							onClick={() => {
								if (pageInfo.hasNextPage) {
									fetchMore({
										variables: {
											cursor: pageInfo.endCursor
										},
										updateQuery: (prev, { fetchMoreResult }) => {
											console.log('🔥', prev)
											console.log('⚡️', fetchMoreResult)
										}
									})
								}
							}}>
							Next
						</Button>
					</Pane>
				)
			}}
		</Query>
	)
}

export default User
