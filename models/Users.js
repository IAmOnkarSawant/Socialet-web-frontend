import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			default: "guest",
		},
		email: {
			type: String,
		},
		password: {
			type: String,
		},
		image: {
			type: String,
			default:
				"https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png",
		},
		emailVerified: {
			type: String,
			default: null,
		},
		channel_id:{
			type: mongoose.Types.ObjectId,
			ref:'Channel',
			default:null
		},
	},
	{ timestamps: true }
);

export default mongoose.models.users || mongoose.model("users", userSchema);
