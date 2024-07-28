import { gql } from "@apollo/client";

export const UPDATE_PROFILE = gql`
    mutation UpdateProfile(
    $fullname: String!
    $file: Upload
    $id: String!
    ) {
        updateProfile(
            fullname:$fullname
            file: $file
            id: $id
        ) {
            id
            fullname
            avatarUrl
        
        }

    }
`